"use client";

import Image from "next/image";

const games = [
  {
    tag: "Deduction & Consequence",
    title: "Not the Pigs' Fault",
    description:
      "A strategic deduction game: discover who pulls the strings, measure the cost of each choice, and face the consequences of your decisions.",
    image: "/not-the-pigs-fault.png",
    cta: { label: "Play Now", href: "https://pigs-blame-game.base44.app/" },
  },
  {
    tag: "Card Clash · Burn Power",
    title: "Force Game",
    description:
      "Card confrontation based on Burn Power. The stronger your hand, the greater the impact — inside and outside the game.",
    image: "/cpigs-card-back.png",
    cta: { label: "Enter the Force Game", href: "/games" },
  },
];

const AboutSection = () => {
  return (
    <section id="games" className="py-24 section-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-tight">
            We Don&apos;t Tell You What To Think.
            <br />
            <span className="text-primary">We Give You Reasons To Question.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CPigs creates a relaxed space where it&apos;s possible to recognize corrupt
            behavior without pointing fingers. Through play, each person understands how
            small decisions — shortcuts, favors, silence — transform into entire systems.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We don&apos;t give answers. We give situations, choices, and consequences. The
            rest is a conversation that stays with you after the game ends.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {games.map((game, i) => (
            <div
              key={game.title}
              className="glass-card overflow-hidden group hover:border-primary/60 transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className={`relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden flex-shrink-0 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r md:from-transparent md:to-card md:via-transparent" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                <p className="text-xs text-accent font-heading mb-2 uppercase tracking-wider">
                  {game.tag}
                </p>
                <h3 className="font-display text-2xl text-foreground mb-3">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {game.description}
                </p>
                <a
                  href={game.cta.href}
                  target={game.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={game.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity self-start"
                >
                  {game.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 text-center">
            <h3 className="font-display text-xl text-foreground mb-4">More Than a Game</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Behind the cards is a reflection on power, greed, and how easily we normalize
              what should shock us.
            </p>
            <blockquote className="text-lg italic text-accent font-medium">
              &ldquo;What if it&apos;s not the pigs&apos; fault? What if each of us has a
              corrupt little pig inside?&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="relative mt-16 rounded-2xl overflow-hidden max-w-sm mx-auto">
          <Image
            src="/pigres-demoniacos.png"
            alt="Corrupted Pigs surrounded by flaming boars"
            width={400}
            height={267}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
