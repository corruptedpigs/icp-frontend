"use client";

const CommunitySection = () => {
  const items = [
    {
      title: "Guerilla Marketing",
      desc: "From flash mob campaigns to gaming fairs, IRL interventions with humans wearing costumes of pigs is part of the brand's marketing strategy from day one.",
      icon: "🐷",
    },
    {
      title: "X Spaces",
      desc: "CPigs™ engages in online voice discussions dissecting corruption, exposing real-world issues, and challenging systemic problems.",
      icon: "𝕏",
    },
    {
      title: "Solutions Journalism",
      desc: "Reporting responses to social issues anchored in credible evidence, explaining how and why responses are working, or not working.",
      icon: "📰",
    },
  ];

  return (
    <section id="community" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-primary text-glow-pink mb-2">
          COMMUNITY
        </h2>
        <p className="text-center font-heading text-accent text-sm mb-12">ENGAGEMENT & IMPACT</p>

        <div className="relative rounded-2xl overflow-hidden mb-16">
          <img src="/community-pigs.jpg" alt="Community of pigs" loading="lazy" width={1280} height={720} className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 font-display text-2xl md:text-3xl text-foreground">
            &quot;Not by the Hair of My Chinny-chin-chin&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="glass-card p-8 hover:border-primary/50 transition-colors">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-heading text-lg text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="https://x.com/CorruptedPigs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity">
            Follow @CorruptedPigs
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;