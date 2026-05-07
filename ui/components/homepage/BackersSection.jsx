"use client";

import Image from "next/image";

const tiers = [
  {
    name: "Piglet",
    price: "€15",
    image: "/images/backers/piglet.png",
    perks: [
      "1 pack of 5 NFTs",
      "1,000,000 COINKs",
    ],
    highlight: false,
  },
  {
    name: "Pig",
    price: "€45",
    image: "/images/backers/pig.png",
    perks: [
      "3 packs of 15 NFTs",
      "10,000,000 COINKs",
    ],
    highlight: false,
  },
  {
    name: "Hog",
    price: "€95",
    image: "/images/backers/hog.png",
    perks: [
      "6 packs of 30 NFTs",
      "20,000,000 COINKs",
      "Basic merchandise",
    ],
    highlight: false,
  },
  {
    name: "Boar",
    price: "€1,000",
    image: "/images/backers/boar.png",
    perks: [
      "20 packs of 100 NFTs",
      "50,000,000 COINKs",
      "Premium merchandise",
      "VIP access (Very Important Pig)",
    ],
    highlight: true,
  },
  {
    name: "Orc",
    price: "€3,000",
    image: "/images/backers/orc.png",
    perks: [
      "30 packs of 150 NFTs",
      "100,000,000 COINKs",
      "Premium merchandise",
      "VIP access (Very Important Pig)",
      "Physical NFT with gold",
    ],
    highlight: false,
  },
  {
    name: "CPig",
    price: "Per Case",
    image: "/images/backers/cpig.png",
    perks: [
      "Entry by case / invitation only",
      "Join the co-founders in building the brand",
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
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <h3 className="font-heading text-lg text-foreground">{tier.name}</h3>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={tier.image}
                    alt={tier.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="80px"
                  />
                </div>
              </div>

              {tier.highlight && (
                <span className="text-[10px] font-heading bg-primary text-primary-foreground px-3 py-1 rounded-full self-start mb-4">
                  POPULAR
                </span>
              )}
              <p className="font-display text-2xl text-primary mb-6">{tier.price}</p>
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
