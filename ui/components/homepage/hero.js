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
          <div className="lg:w-1/2 lg:ml-6 text-neutral-content">
          <div className="hidden lg:block mb-4">
              <Image src="/logo.png"
                alt="corrupted pigs logo"
                height={120}
                width={124}
                priority
              />
            </div>
            <h1 className="mb-5 text-5xl font-bold">Power Up for Good</h1>
            <p className="mb-5 text-2xl font-bold"> Corrupted Pigs&apos; NFTs fuel social causes. Play. Earn. Make a Difference.</p>
            <CtaGoogleAnalytics
              buttonText="Get your t-shirt and support the cause"
              buttonClass="btn btn-warning hover:animate-[wiggle_1s_ease-in-out_infinite]"
              url="https://corruptedpigs.store"
              ctaLabel="cta-merch-hero"
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
