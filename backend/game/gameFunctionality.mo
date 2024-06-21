import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Map "mo:map/Map";
import { nhash; thash } "mo:map/Map";
import Vector "mo:vector/Class";

shared actor class GameFunctionality() = Self {

  // Define a type for cards
  type Card = Nat;

  // Define a type for players
  type Player = {
      id : Text;
      cards : [Card];
      currentMatchId: ?Nat;
  };

  // Define a type for the game state
  type Match = {
    id: Nat;
    player1 : Player;
    player2 : Player;
    card1: ?Nat;
    card2: ?Nat;
    winner : ?Player;
  };

  var nextMatchId  : Nat = 0;

  // Player Matches
  let matches = Map.new<Nat, Match>();

  // Players in Matches
  let players_in_matches = Map.new<Text, Bool>();

  // Player Queue
  let queue = Vector.Vector<Player>();

  func _checkInGame(playerId : Text) : Bool {
    Debug.print(debug_show players_in_matches);
    switch(Map.get(players_in_matches, thash, playerId)){
      case(?inMatch){
        return true;
      };
      case(null){
        return false;
      };
    }
  };

  public func checkWinner(matchId: Nat) : async Text {
    switch(Map.get(matches, nhash, matchId)){
      case(?match){
        switch(match.card1){
          case(?card1){
            switch(match.card2){
              case(?card2){
                if(card1 > card2) {
                  return match.player1.id;
                };
                if(card2 > card1) {
                  return match.player2.id;
                };
                return "Tie";
              };
              case(null){
                return "Error";
              };
            };
          };
          case(null){
            return "Error";
          };
        };
      };
      case(null){
        return "Error";
      };
    };
  };

  public func makePlay(playerId: Text, matchId: Nat, play: Nat) : async Result.Result<Text, Text> {
    switch(Map.get(matches, nhash, matchId)){
      case(?match){
        if(playerId == match.player1.id) {
          let newMatch : Match = {
            match with card1 = ?play;
          };
          Map.set(matches, nhash, matchId, newMatch);
          return #ok("Play successfull");
        };
        if(playerId == match.player2.id) {
          let newMatch : Match = {
            match with card2 = ?play;
          };
          Map.set(matches, nhash, matchId, newMatch);
          return #ok("Play successfull");
        };
        return #err("Player is not in the match provided");
      };
      case(null) {
        return #err("Match not found");
      };
    };
  };

  public func checkGameStart(playerId : Text) : async Result.Result<Match, Text> {
    if(_checkInGame(playerId) == false){
      return #err("You are not in a match");
    };
    for(match in Map.vals(matches)) {
      if(match.player1.id == playerId or match.player2.id == playerId) {
        return #ok(match);
      };
    };
    return #err("Didn't find your match");
  };

  // Function to match players
  public func joinGame(playerId : Text, cards: [Card]) : async Result.Result<Match, Text> {

    if(queue.size() >= 2) {
      return #err("The Queue of players is full");
    };

    if(queue.size() >= 1 and playerId == queue.get(0).id){
      return #err("You are already in queue");
    };

    if(_checkInGame(playerId) == true) {
      return #err("You are already in a match");
    };

    let newPlayer : Player = {
      id = playerId;
      cards;
      currentMatchId = null;
    };

    queue.add(newPlayer);

    if(queue.size() == 2){

      let player1 : Player = queue.get(0);
      let player2 : Player = queue.get(1);

      Map.set(players_in_matches, thash, player1.id, true);
      Map.set(players_in_matches, thash, player2.id, true);

      queue.clear();

      let newMatch : Match = {
        id = nextMatchId;
        player1;
        player2;
        card1 = null;
        card2 = null;
        winner = null;
      };

      Map.set(matches, nhash, nextMatchId, newMatch);

      nextMatchId := nextMatchId + 1;

      return #ok(newMatch);
    };

    return #err("There are no players in queue");
  };

  public func cleanQueue() : async Text {
    queue.clear();
    Map.clear(matches);
    Map.clear(players_in_matches);
    nextMatchId := 0;
    return "Cleared Queue";
  };
}



















