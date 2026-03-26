"use client";

const allocations = [
  { name: "Social/Charitable Projects", pct: "25%", tokens: "250 trillion", note: "Philanthropy and social impact" },
  { name: "Development & Maintenance", pct: "15%", tokens: "150 trillion", note: "Ongoing IT, Art, maintenance" },
  { name: "Community Airdrops", pct: "10%", tokens: "100 trillion", note: "Adoption & play-to-earn bonuses" },
  { name: "Marketing & Partnerships", pct: "8%", tokens: "80 trillion", note: "Ecosystem growth" },
  { name: "Founders", pct: "5%", tokens: "50 trillion", note: "Long-term allocation" },
  { name: "Liquidity Provision", pct: "5%", tokens: "50 trillion", note: "Token liquidity in exchanges" },
  { name: "Reserve Fund", pct: "3%", tokens: "30 trillion", note: "Safeguard for unforeseen needs" },
];

const pieSegments = [
  { label: "Social/Charitable", pct: 25, color: "hsl(320, 100%, 60%)" },
  { label: "Dev & Maintenance", pct: 15, color: "hsl(280, 60%, 50%)" },
  { label: "Community Airdrop", pct: 10, color: "hsl(42, 90%, 55%)" },
  { label: "Marketing", pct: 8, color: "hsl(200, 70%, 50%)" },
  { label: "Founders", pct: 5, color: "hsl(150, 60%, 45%)" },
  { label: "Liquidity", pct: 5, color: "hsl(350, 70%, 50%)" },
  { label: "Reserve", pct: 3, color: "hsl(30, 80%, 50%)" },
  { label: "Investors", pct: 29, color: "hsl(260, 50%, 40%)" },
];

const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 mb-4">
          <img src="/coin.png" alt="$COINK" loading="lazy" className="w-20 h-20 animate-float" />
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-accent text-glow-gold">$COINK</h2>
            <p className="font-heading text-lg text-foreground">MEMECOIN</p>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6 text-sm leading-relaxed">
          Memecoins represent 2.24% of the total cryptocurrency market cap, projected to grow at a <span className="text-primary font-bold">CAGR of 28.2%</span> from 2023 to 2030, potentially reaching a market value of $337 billion.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start mt-12">
          <div className="glass-card p-8">
            <h3 className="font-heading text-sm text-accent mb-6">TOKENOMICS DISTRIBUTION</h3>
            <div className="grid grid-cols-2 gap-3">
              {pieSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs text-muted-foreground">{seg.label}: <span className="text-foreground font-semibold">{seg.pct}%</span></span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 border-t border-border/50 pt-4">
              Total Supply: <span className="text-accent font-bold">1 Quadrillion tokens</span>
            </p>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-4 gap-2 p-4 bg-secondary/50 text-xs font-heading text-accent">
              <span>Allocation</span><span>%</span><span>Tokens</span><span>Notes</span>
            </div>
            {allocations.map((a, i) => (
              <div key={a.name} className={`grid grid-cols-4 gap-2 p-4 text-xs ${i % 2 === 0 ? "bg-card/30" : ""}`}>
                <span className="text-foreground font-medium">{a.name}</span>
                <span className="text-primary font-bold">{a.pct}</span>
                <span className="text-muted-foreground">{a.tokens}</span>
                <span className="text-muted-foreground">{a.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;