/* eslint-disable @next/next/no-img-element */

'use client';

import HeroSection from "../ui/components/homepage/HeroSection"
import AboutSection from "../ui/components/homepage/AboutSection"
import GameModesSection from "../ui/components/homepage/GameModesSection"
import TokenomicsSection from "../ui/components/homepage/TokenomicsSection"
import CommunitySection from "../ui/components/homepage/CommunitySection"
import BackersSection from "../ui/components/homepage/BackersSection"
import NewNavbar from "../ui/components/homepage/NewNavbar"
import NewFooter from "../ui/components/homepage/NewFooter"

import styles from "../styles/Home.module.css"


function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <NewNavbar />
        <HeroSection />
        <AboutSection />
        <GameModesSection />
        <TokenomicsSection />
        <CommunitySection />
        <BackersSection />
        <NewFooter />
      </main>
    </div>
  )
}

export default HomePage