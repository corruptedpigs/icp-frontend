"use client";

const AboutSection = () => {
  const features = [
    { icon: "🎴", title: "NFT Cards", desc: "Collect unique pig cards with special abilities and Burn Power" },
    { icon: "🔥", title: "Burn Mechanic", desc: "Burn NFTs to double Burn Power in other cards" },
    { icon: "💰", title: "$COINK Memecoin", desc: "Earn real cryptocurrency through gameplay" },
    { icon: "🤝", title: "Social Impact", desc: "Every transaction supports charitable causes" },
    { icon: "🔗", title: "Multichain", desc: "Solana, BTC Ordinals, and Polygon NFT support" },
    { icon: "🎰", title: "Casino-Style", desc: "Strategic card games with real stakes" },
  ];

  return (
    <section id="about" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-primary text-glow-pink mb-2">
              PLAY-TO-EARN
            </h2>
            <p className="font-heading text-xl text-accent mb-6">MEETS SOCIAL GOODS</p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For each corrupted pig NFT card players burn and for every in-game transaction, a percentage is dedicated to supporting various social causes and community-vetted charitable organizations.
            </p>
            <p className="text-foreground font-medium italic mb-8">
              Yes, it is possible to transform corruption into transparency, earning money, and sharing it with the ones that also need it, <span className="text-primary font-bold">while playing a game!!!</span>
            </p>
            <div className="glass-card p-6">
              <h3 className="font-heading text-sm text-accent mb-3">HOW TO START</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>→ Connect your wallet</li>
                <li>→ Own at least 3 NFT cards to play</li>
                <li>→ Each card has a <span className="text-accent font-semibold">Burn Power</span></li>
                <li>→ Burn cards to double power in others</li>
                <li>→ Win opponents&apos; cards in game modes!</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <img src="/pig-suit.jpg" alt="Pig in a suit" loading="lazy" className="w-full max-w-md mx-auto rounded-2xl border-2 border-border/50 shadow-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-20">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-heading text-sm text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;