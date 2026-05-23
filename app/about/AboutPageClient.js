"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../ui/components/homepage/navbar";
import Avatar from "../components/avatar";
import Footer from "../../ui/components/homepage/footer";
import { checkAndPersistFlag } from "../utils/featureFlags";

export default function AboutPageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isUnlocked = checkAndPersistFlag("about", searchParams);
    setUnlocked(isUnlocked);
    setChecking(false);
  }, [searchParams]);

  if (checking) return null;
  if (!unlocked) return <LockedState />;

  return (
    <main>
      <div className="bg-violet">
        <Navbar/>
      </div>

      <section
        id="hero2"
        style={{
          backgroundImage: "url('/TRADER-2-faded.png')",
          backgroundSize: "380px",
          backgroundPosition: 'bottom left',
          backgroundRepeat: "no-repeat"
        }}
        className='hero bg-pig min-h-[625px]'
      >
        <div className="hero-overlay custom-hero-overlay"></div>
        <div className="hero-content text-neutral-content py-12 max-w-screen-xl">
          <div className="flex flex-col items-center">
            <h1 className="mb-14 text-4xl font-bold">The Team</h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Avatar name="Henrik Kinell" role="CEO" src="/images/team/henrik.png"/>
              <Avatar name="Nuno Costa" role="CTO"  src="/images/team/ncosta.webp"/>
              <Avatar name="Tiago Quintans" role="COO" src="/images/team/tiago.webp"/>
              <Avatar name="Nuno Amiar" role="CMO" src="/images/team/amiar.png"/>
              <Avatar name="Eddie Nes" role="NFT Artist, Designer" src="/images/team/eddie.webp"/>
            </div>
          </div>
        </div>
      </section>

      <hr className="bg-purple glow"/>
      <Footer/>
    </main>
  );
}

function LockedState() {
  return (
    <div className="text-center max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center">
      <div className="mb-6 text-7xl">🐷</div>
      <h1 className="font-display text-4xl text-white text-glow-pink mb-3">
        ACCESS RESTRICTED
      </h1>
      <p className="text-purple-300/60 font-heading text-sm leading-relaxed mb-6">
        The Team page is currently in testing mode.<br />
        If you have an access link, please use it to unlock this page.
      </p>
      <div className="rounded-xl bg-black/40 border border-pink-500/20 px-4 py-3 text-xs text-purple-400/50 font-mono">
        <span className="text-pink-400/70">Talk to an Administrator to unlock access</span>
      </div>
    </div>
  );
}
