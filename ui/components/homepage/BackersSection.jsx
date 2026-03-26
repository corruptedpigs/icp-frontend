"use client";

const tiers = [
  {
    name: "Piglet Backer",
    range: "€100 – €499",
    perks: [
      "Shout-out on social media as early supporter",
      "Exclusive Corrupted Pigs™ meme sticker pack",
      "Access to the Pigsty Community",
      "1,000,000 COINKs",
    ],
    highlight: false,
  },
  {
    name: "Entry-Level Investor",
    range: "€500 – €10,000",
    perks: [
      "10,000,000 $COINK tokens",
      "Early access to NFT collections",
      "Investor-exclusive updates & reports",
      "Recognition on official website",
    ],
    highlight: false,
  },
  {
    name: "Growth Investor",
    range: "€10,001 – €50,000",
    perks: [
      "Higher token allocation proportional to investment",
      "Exclusive NFTs from higher rarity tiers",
      "Partial profit-sharing via $COINK staking",
      "Voting rights in the DAO",
    ],
    highlight: true,
  },
  {
    name: "Strategic Investor",
    range: "€50,001 – €250,000",
    perks: [
      "Priority staking rights for high APY",
      "Beta-testing access to gamified features",
      "Up to 3% of net annual profit",
      "Name & design an in-game character",
      "Limited edition physical merchandise",
    ],
    highlight: false,
  },
  {
    name: "Corporate Partner",
    range: "€250,001+",
    perks: [
      "10% of profits distributed quarterly + equity options",
      "Naming rights to significant in-game entity",
      "Feature branding/advertising in-game",
      "Founding investor plaque (virtual & real-world)",
    ],
    highlight: false,
  },
];

const BackersSection = () => {
  return (
    <section id="backers" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-accent text-glow-gold mb-2">
          BECOME A BACKER
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto text-sm">
          Join the revolution. Choose your tier and help transform corruption into transparency.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                tier.highlight ? "border-primary/70 shadow-lg shadow-primary/10 ring-1 ring-primary/30" : "hover:border-primary/40"
              } ${tier.name === "Corporate Partner" ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              {tier.highlight && (
                <span className="text-[10px] font-heading bg-primary text-primary-foreground px-3 py-1 rounded-full self-start mb-4">
                  POPULAR
                </span>
              )}
              <h3 className="font-heading text-lg text-foreground mb-1">{tier.name}</h3>
              <p className="font-display text-2xl text-primary mb-6">{tier.range}</p>
              <ul className="space-y-2 flex-1">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-accent flex-shrink-0">✦</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-heading text-sm hover:bg-secondary/80 transition-colors">
                GET STARTED
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BackersSection;