"use client";

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { config } from "react-spring";

const Carousel = dynamic(
  () => import('react-spring-3d-carousel'),
  { ssr: false }
);

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      key: uuidv4(),
      content: <Image src="/carta1.png" alt="Pig card1" height={600} width={450} />
    },
    {
      key: uuidv4(),
      content: <Image src="/carta2.png" alt="Pig card2" height={600} width={450} />
    },
    {
      key: uuidv4(),
      content: <Image src="/carta3.png" alt="Pig card3" height={600} width={450} />
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-background/60" />

      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-glow-pink text-primary mb-4">
              CORRUPTED PIGS™
            </h1>
            <p className="font-heading text-lg md:text-xl text-accent mb-4">
              NFT TRADING CARD GAME
            </p>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              An NFT-based social impact game that blends fun, strategy, and purpose. Collect unique pig cards, earn <span className="text-accent font-bold">$COINK</span> memecoins, and burn NFTs to unlock rewards — all while contributing to meaningful social causes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="/games" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-heading text-sm hover:opacity-90 transition-opacity">
                PLAY NOW
              </a>
              <a href="#tokenomics" className="px-8 py-3 rounded-lg border-2 border-accent text-accent font-heading text-sm hover:bg-accent/10 transition-colors">
                $COINK TOKEN
              </a>
            </div>

            <div className="flex gap-6 mt-10 justify-center lg:justify-start">
              {["Blockchain Gaming", "Social Impact", "Multichain"].map((tag) => (
                <span key={tag} className="text-xs font-medium text-muted-foreground border border-border/60 rounded-full px-4 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center" style={{ height: "500px", width: "100%" }}>
            <Carousel slides={slides} goToSlide={activeSlide} animationConfig={config.slow} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
