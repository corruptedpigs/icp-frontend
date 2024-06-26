import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <section id="hero2" className='hero bg-pig'>
      <div className="hero-overlay custom-hero-overlay"></div>
      <div className="hero-content grid grid-cols-1 py-12">
        <div className="lg:flex lg:justify-between">
          <article className="lg:w-1/2 mb-10 lg:mb-0 lg:mx-6 xl:mx-0 text-neutral-content">
            <h1 className="mb-5 text-5xl font-bold">Challenge the System.</h1>
            <h2 className="mb-5 text-2xl font-bold">Corrupted Pigs&apos; Online Card Game - Coming Soon. Sharpen your skills and rise to the top.</h2>
            <p className='text-xl'>
              &quot;Corrupted Pigs&quot; is an NFT collection, where users can purchase unique digital assets. These NFTs grant access to three distinct games within our platform. As players engage with these games, a portion of the proceeds from burning NFTs will be donated to social causes. It&apos;s a novel way to combine gaming, rewards, and social impact, all while supporting meaningful initiatives. 🎮🐷 oink oink
            </p>
            <Link className="link" href="https://corruptedpigs.notion.site/Game-Rules-643b79c0b7394b6dafd9adc54157cc80">Game Rules</Link>
          </article>
          <div className="lg:w-1/2 lg:mx-0 mt-8 lg:mt-0">
            <div className="mockup-browser border bg-slate-300 max-w-xl mx-auto">
              <div className="mockup-browser-toolbar">
                <div className="input text-sm sm:text-base">https://corruptedpigs.com</div>
              </div>
              <div className="flex justify-center px-4 py-6 bg-slate-800">
                <Image src="/game-demo.jpeg" alt="Game demo" height={566} width={900}></Image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;
