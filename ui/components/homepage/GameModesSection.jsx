"use client";

const modes = [
  {
    title: "LOGIC",
    image: "/images/games/guessing-normal-2.png",
    color: "primary",
    description: "Players arrange and guess the order of their opponent's cards. The winner takes one and earns $COINKs.",
    phases: [
      "Each player selects 3 cards and puts them into play",
      "Select an ordered sequence for the 3 cards",
      "Guess the opponent's card order simultaneously",
      "The player who guesses correctly wins the round",
    ],
  },
  {
    title: "STRENGTH",
    image: "/images/games/strength-normal-2.png",
    color: "accent",
    description: "Requires players to have burned an NFT card. Cards battle based on Burn Power. Winners claim defeated cards.",
    phases: [
      "Players choose 3 cards, matched by total Burn Power tier",
      "Each player selects a card from the opponent",
      "Selected cards are revealed simultaneously",
      "The card with the most Burn Power wins",
    ],
  },
  {
    title: "MULTIPLAYER",
    image: "/images/games/luck-normal-2.png",
    color: "primary",
    description: "3–7 participants activate cards and guess the total activated count. Winner earns all cards + $COINKs.",
    phases: [
      "Each player chooses 3 cards and secretly activates 0–3",
      "Guess the total number of activated cards",
      "Predictions submitted simultaneously",
      "Exact guesser wins all cards",
    ],
  },
];

const GameModesSection = () => {
  return (
    <section id="game-modes" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-primary text-glow-pink mb-2">
          GAME MODES
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Three distinct ways to compete, strategize, and earn
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {modes.map((mode) => (
            <div key={mode.title} className="glass-card overflow-hidden group hover:border-primary/60 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={mode.image} alt={mode.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <h3 className="absolute bottom-4 left-6 font-display text-3xl text-foreground">{mode.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                <div className="space-y-2">
                  {mode.phases.map((phase, i) => (
                    <div key={i} className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-accent font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span>{phase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 font-display text-xl text-accent">
          &quot;Four legs good, two legs bad!&quot;
        </p>
      </div>
    </section>
  );
};

export default GameModesSection;
