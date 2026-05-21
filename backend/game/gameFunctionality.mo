import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Map "mo:map/Map";
import { nhash; thash } "mo:map/Map";
import Vector "mo:vector/Class";

shared (install) actor class GameFunctionality() = Self {

  // ── Types ────────────────────────────────────────────────────────────────

  type Card = Nat;

  type Player = {
    id : Text;
    cards : [Card];
    currentMatchId : ?Nat;
  };

  type Match = {
    id : Nat;
    player1 : Player;
    player2 : Player;
    selectedCards1 : [Card];
    selectedCards2 : [Card];
    guessedOrder1 : [Card];
    guessedOrder2 : [Card];
    winner : ?Player;
  };

  // ── ICP management canister – HTTPS Outcalls ─────────────────────────────

  type HttpHeader = { name : Text; value : Text };

  type HttpMethod = { #get; #post; #head };

  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?Blob;
    method : HttpMethod;
    transform : ?TransformContext;
  };

  type HttpResponse = {
    status : Nat;
    headers : [HttpHeader];
    body : Blob;
  };

  type TransformArgs = { response : HttpResponse; context : Blob };

  type TransformContext = {
    function : shared query TransformArgs -> async HttpResponse;
    context : Blob;
  };

  let ic : actor {
    http_request : shared HttpRequestArgs -> async HttpResponse;
  } = actor "aaaaa-aa";

  // ── Secrets (stable, controller-only) ────────────────────────────────────

  stable var _gameResultApiKey : Text = "";
  stable var _gameResultApiUrl : Text = "";

  let _controller : Principal = install.caller;

  public shared (msg) func setGameResultApiKey(key : Text) : async Result.Result<Text, Text> {
    if (msg.caller != _controller) { return #err("Unauthorized") };
    _gameResultApiKey := key;
    #ok("API key updated")
  };

  public shared (msg) func setGameResultApiUrl(url : Text) : async Result.Result<Text, Text> {
    if (msg.caller != _controller) { return #err("Unauthorized") };
    _gameResultApiUrl := url;
    #ok("API URL updated")
  };

  // ── State ─────────────────────────────────────────────────────────────────

  var nextMatchId : Nat = 0;

  let matches = Map.new<Nat, Match>();
  let players_in_matches = Map.new<Text, Bool>();
  let queue = Vector.Vector<Player>();

  // ── Internal helpers ──────────────────────────────────────────────────────

  func _checkInGame(playerId : Text) : Bool {
    Debug.print(debug_show players_in_matches);
    switch (Map.get(players_in_matches, thash, playerId)) {
      case (?_) { true };
      case null { false };
    };
  };

  func _natToText(n : Nat) : Text { Nat.toText(n) };

  // Fire-and-forget game result notification via ICP HTTPS Outcall.
  // Called after checkWinner resolves; errors are silently dropped so that
  // a failing external API never breaks the on-chain game flow.
  func _notifyGameResult(
    winner : Text,
    loser : Text,
    tokenIdCardA : Text,
    tokenIdCardB : Text,
    tokenIdLost : Text,
    tokenIdToAddPower : Text,
  ) : async () {
    if (_gameResultApiUrl == "" or _gameResultApiKey == "") {
      Debug.print("[notifyGameResult] API URL or key not configured – skipping outcall");
      return;
    };

    let jsonBody =
      "{"
      # "\"apiKey\":\""           # _gameResultApiKey       # "\","
      # "\"winner\":\""           # winner                  # "\","
      # "\"loser\":\""            # loser                   # "\","
      # "\"tokenIdCardA\":\""     # tokenIdCardA            # "\","
      # "\"tokenIdCardB\":\""     # tokenIdCardB            # "\","
      # "\"tokenIdLost\":\""      # tokenIdLost             # "\","
      # "\"tokenIdToAddPower\":\"" # tokenIdToAddPower      # "\""
      # "}";

    let request : HttpRequestArgs = {
      url = _gameResultApiUrl;
      max_response_bytes = ?2_000;
      headers = [{ name = "Content-Type"; value = "application/json" }];
      body = ?Text.encodeUtf8(jsonBody);
      method = #post;
      transform = null;
    };

    try {
      Cycles.add<system>(20_000_000_000);
      ignore await ic.http_request(request);
    } catch (e) {
      Debug.print("[notifyGameResult] HTTPS outcall failed: " # debug_show e);
    };
  };

  // ── Public functions ──────────────────────────────────────────────────────

  public func checkWinner(matchId : Nat) : async Text {
    switch (Map.get(matches, nhash, matchId)) {
      case (?match) {
        // Count positions where player 2's guess matches player 1's selected card
        var correctGuesses1 : Nat = 0;
        for (i in Iter.range(0, 2)) {
          if (i < Array.size(match.selectedCards1) and i < Array.size(match.guessedOrder2)) {
            if (match.selectedCards1[i] == match.guessedOrder2[i]) {
              correctGuesses1 += 1;
            };
          };
        };

        // Count positions where player 1's guess matches player 2's selected card
        var correctGuesses2 : Nat = 0;
        for (i in Iter.range(0, 2)) {
          if (i < Array.size(match.selectedCards2) and i < Array.size(match.guessedOrder1)) {
            if (match.selectedCards2[i] == match.guessedOrder1[i]) {
              correctGuesses2 += 1;
            };
          };
        };

        let winnerId : Text = if (correctGuesses1 > correctGuesses2) {
          match.player1.id
        } else if (correctGuesses2 > correctGuesses1) {
          match.player2.id
        } else {
          "Tie"
        };

        // Notify external API (best-effort, does not affect return value)
        if (winnerId != "Tie") {
          let (winnerPlayer, loserPlayer) = if (winnerId == match.player1.id) {
            (match.player1, match.player2)
          } else {
            (match.player2, match.player1)
          };

          let tokenIdCardA = if (Array.size(winnerPlayer.cards) > 0) {
            _natToText(winnerPlayer.cards[0])
          } else { "0" };
          let tokenIdCardB = if (Array.size(loserPlayer.cards) > 0) {
            _natToText(loserPlayer.cards[0])
          } else { "0" };

          ignore _notifyGameResult(
            winnerPlayer.id,
            loserPlayer.id,
            tokenIdCardA,
            tokenIdCardB,
            tokenIdCardB,   // tokenIdLost  = loser's first card
            tokenIdCardA,   // tokenIdToAddPower = winner's first card
          );
        };

        winnerId
      };
      case null { "Error" };
    };
  };

  public func selectCards(playerId : Text, matchId : Nat, cards : [Card]) : async Result.Result<Text, Text> {
    if (Array.size(cards) != 3) {
      return #err("You must select exactly 3 cards");
    };
    switch (Map.get(matches, nhash, matchId)) {
      case (?match) {
        if (playerId == match.player1.id) {
          Map.set(matches, nhash, matchId, { match with selectedCards1 = cards });
          return #ok("Cards selected successfully");
        };
        if (playerId == match.player2.id) {
          Map.set(matches, nhash, matchId, { match with selectedCards2 = cards });
          return #ok("Cards selected successfully");
        };
        #err("Player is not in the match provided")
      };
      case null { #err("Match not found") };
    };
  };

  public func guessOrder(playerId : Text, matchId : Nat, guessedOrder : [Card]) : async Result.Result<Text, Text> {
    if (Array.size(guessedOrder) != 3) {
      return #err("You must guess the order of exactly 3 cards");
    };
    switch (Map.get(matches, nhash, matchId)) {
      case (?match) {
        if (playerId == match.player1.id) {
          Map.set(matches, nhash, matchId, { match with guessedOrder1 = guessedOrder });
          return #ok("Order guessed successfully");
        };
        if (playerId == match.player2.id) {
          Map.set(matches, nhash, matchId, { match with guessedOrder2 = guessedOrder });
          return #ok("Order guessed successfully");
        };
        #err("Player is not in the match provided")
      };
      case null { #err("Match not found") };
    };
  };

  public func checkGameStart(playerId : Text) : async Result.Result<Match, Text> {
    if (not _checkInGame(playerId)) {
      return #err("You are not in a match");
    };
    for (match in Map.vals(matches)) {
      if (match.player1.id == playerId or match.player2.id == playerId) {
        return #ok(match);
      };
    };
    #err("Didn't find your match")
  };

  public func joinGame(playerId : Text, cards : [Card]) : async Result.Result<Match, Text> {
    if (queue.size() >= 2) {
      return #err("The Queue of players is full");
    };
    if (queue.size() >= 1 and playerId == queue.get(0).id) {
      return #err("You are already in queue");
    };
    if (_checkInGame(playerId)) {
      return #err("You are already in a match");
    };

    let newPlayer : Player = { id = playerId; cards; currentMatchId = null };
    queue.add(newPlayer);

    if (queue.size() == 2) {
      let player1 : Player = queue.get(0);
      let player2 : Player = queue.get(1);

      Map.set(players_in_matches, thash, player1.id, true);
      Map.set(players_in_matches, thash, player2.id, true);
      queue.clear();

      let newMatch : Match = {
        id = nextMatchId;
        player1;
        player2;
        selectedCards1 = [];
        selectedCards2 = [];
        guessedOrder1 = [];
        guessedOrder2 = [];
        winner = null;
      };

      Map.set(matches, nhash, nextMatchId, newMatch);
      nextMatchId += 1;

      return #ok(newMatch);
    };

    #err("There are no players in queue")
  };

  public func cleanQueue() : async Text {
    queue.clear();
    Map.clear(matches);
    Map.clear(players_in_matches);
    nextMatchId := 0;
    "Cleared Queue"
  };
}
