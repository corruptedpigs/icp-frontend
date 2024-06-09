"use client";

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import React, { useState } from 'react';
import { config } from "react-spring";
import CtaGoogleAnalytics from "../cta_google_analytics";
import dynamic from 'next/dynamic';
import Navbar from "../../components/homepage/navbar";

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
      <div className="hero-content grid grid-cols-1 container">
        <Navbar />

        <div className="xl:flex xl:justify-between">
          <div className="mb-20 sm:mx-6 lg:mx-0 lg:mb-10 text-neutral-content">
            <h1 className="mb-5 text-5xl font-bold">Be a Game Changer</h1>

            <dd className='mb-8 space-y-4'>
              <dt className='text-2xl font-bold mt-8'>What?</dt>
              <dl className='text-xl'>An NFT-based game where players collect, trade, and play with unique Corrupted Pigs NFTs, earning tokens and supporting social causes.</dl>

              <dt className='text-2xl font-bold mt-8'>Why?</dt>
              <dl className='text-xl'>Corrupted Pigs blends gaming with social impact, aiming to drive positive change through engaging gameplay and blockchain technology.</dl>

              <dl className='text-2xl font-bold mt-8'>How?</dl>
              <dt className='text-xl'>Launch NFTs, engage in casino-style games, stake Coinks, and allocate proceeds to social causes. Community involvement and future expansions enhance impact.</dt>
            </dd>
            <CtaGoogleAnalytics
              buttonText="Play the game"
              buttonClass="btn btn-block btn-lg float-right md:w-auto btn-warning uppercase hover:animate-bounce "
              url="/games"
              ctaLabel="cta-game"
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
