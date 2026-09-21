"use client";

const allocations = [
  { name: "Social Associations", pct: "40%", note: "Sent via direct burn" },
  { name: "Community & Rewards", pct: "25%", note: "Games, challenges, good deeds" },
  { name: "Development & Games", pct: "20%", note: "New cards and mechanics" },
  { name: "Education & Content", pct: "10%", note: "Manual, videos, workshops" },
  { name: "Operations", pct: "5%", note: "Maintenance costs" },
];

const pieSegments = [
  { label: "Social Associations", pct: 40, color: "hsl(320, 100%, 60%)" },
  { label: "Community & Rewards", pct: 25, color: "hsl(42, 90%, 55%)" },
  { label: "Development & Games", pct: 20, color: "hsl(280, 60%, 50%)" },
  { label: "Education & Content", pct: 10, color: "hsl(200, 70%, 50%)" },
  { label: "Operations", pct: 5, color: "hsl(150, 60%, 45%)" },
];

const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-4">
            <img src="/coin.png" alt="$COINK" loading="lazy" className="w-20 h-20 animate-float" />
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-accent text-glow-gold">$COINK</h2>
              <p className="font-heading text-lg text-foreground">Social Token</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-6">
            What if helping could be more relaxed and fun? Coinks are the energy of the CPigs
            community. When you burn a card, it leaves circulation and the corresponding Coinks
            go directly to a partner association chosen by the community. Less bureaucracy, more
            impact — and a good dose of humor along the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="glass-card p-8">
            <h3 className="font-heading text-sm text-accent mb-6">TOKENOMICS DISTRIBUTION</h3>
            <div className="space-y-4">
              {pieSegments.map((seg) => (
                <div key={seg.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{seg.label}</span>
                    <span className="text-sm font-bold" style={{ color: seg.color }}>{seg.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 border-t border-border/50 pt-4">
              Each Coink has a defined destination. The largest share goes back to those who act:
              community and associations.
            </p>
          </div>

          <div className="glass-card p-8">
            <h3 className="font-heading text-sm text-accent mb-6">BURN SIMULATOR</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Cards to burn</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 10].map((n) => (
                    <span key={n} className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Association to support</label>
                <div className="flex flex-wrap gap-2">
                  {["Food Bank", "Refood", "Salvador Assoc.", "SOS Animal"].map((name) => (
                    <span key={name} className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Coinks generated</p>
                <p className="font-display text-3xl text-accent">750</p>
              </div>
              <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity">
                Burn &amp; Send
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                Demo simulation. No cards are burned here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
