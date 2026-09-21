"use client";

import { useEffect, useRef } from "react";

const communityItems = [
  {
    title: "Guerrilla Marketing — Burn the Paper",
    desc: "Filmed street actions: paper burning, questions lingering. From flash mob campaigns to gaming fairs, real-world interventions are part of the brand from day one.",
    icon: "🔥",
  },
  {
    title: "X Spaces — Good Deed Week",
    desc: "Every Sunday, an open conversation about the week of good deeds. Dissecting corruption, exposing real-world issues, and challenging systemic problems.",
    icon: "𝕏",
  },
  {
    title: "Solutions Journalism",
    desc: "Interviews with those seeking answers rather than blame. Reporting responses to social issues anchored in credible evidence.",
    icon: "📰",
  },
];

const CommunitySection = () => {
  const twitterRef = useRef(null);

  useEffect(() => {
    if (twitterRef.current && !twitterRef.current.querySelector("iframe")) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      twitterRef.current.appendChild(script);
    }
  }, []);

  return (
    <section id="community" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl md:text-5xl text-center text-primary text-glow-pink mb-2">
          COMMUNITY
        </h2>
        <p className="text-center font-heading text-accent text-sm mb-12">ENGAGEMENT &amp; IMPACT</p>

        <div className="relative rounded-2xl overflow-hidden mb-16">
          <img src="/community-pigs.jpg" alt="Community of pigs" loading="lazy" width={1280} height={720} className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 font-display text-2xl md:text-3xl text-foreground">
            &quot;Not by the Hair of My Chinny-chin-chin&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {communityItems.map((item) => (
            <div key={item.title} className="glass-card p-8 hover:border-primary/50 transition-colors">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-heading text-lg text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div id="good-deeds" className="max-w-4xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl text-center text-foreground mb-2">
            Good Deeds Wall
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Write your good deed of the day. Read others. Let yourself be contagioned.
          </p>
          <div className="glass-card p-6 flex justify-center">
            <div ref={twitterRef}>
              <a
                className="twitter-timeline"
                data-height="500"
                data-theme="dark"
                data-chrome="nofooter noheader"
                href="https://twitter.com/corruptedpigs?ref_src=twsrc%5Etfw&f=tweet_search_recent&q=%23gooddeed"
              >
                Tweets by @corruptedpigs
              </a>
            </div>
          </div>
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
