"use client";

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import React, { useState } from 'react';
import { config } from "react-spring";
import CtaGoogleAnalytics from "../cta_google_analytics";
import dynamic from 'next/dynamic';

const Carousel = dynamic(
  () => import('react-spring-3d-carousel'),
  { ssr: false }
);

const Hero = () => {
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

  const discordInviteLink = 'https://discord.gg/x6uJ65PpPj';

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2500); // Change 1000 to adjust rotation interval (in milliseconds)

    return () => clearInterval(intervalId); // Cleanup function to stop interval on unmount
  }, [slides.length]);

  return (
    <section id="hero1" className='hero'>
      <div className="hero-overlay custom-hero-overlay"></div>
      <div className="hero-content grid grid-cols-1 container py-20">
        <div className="lg:flex lg:justify-between">
          <div className="mx-6 mb-10 lg:mx-0 text-neutral-content">
            <div className="hidden lg:block mb-4">
              <Image src="/logo.png"
                alt="corrupted pigs logo"
                height={120}
                width={124}
                priority
              />
            </div>
            <h1 className="mb-5 text-5xl font-bold">Be a Game Changer</h1>
            <p className="mb-5 text-2xl font-bold"> Join Corrupted Pigs' NFTs to support social causes. Game. Earn. Impact Lives.</p>
            <CtaGoogleAnalytics
              buttonText="Join waiting list"
              buttonClass="btn btn-warning uppercase hover:animate-bounce"
              url={discordInviteLink}
              ctaLabel="cta-discord"
            />
          </div>

          <div style={{ height: "500px", width: "100%" }}>
            <Carousel slides={slides} goToSlide={activeSlide} animationConfig={config.slow}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;
