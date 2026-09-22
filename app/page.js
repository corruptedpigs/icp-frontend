/* eslint-disable @next/next/no-img-element */

'use client';

import HeroSection from "../ui/components/homepage/HeroSection"
import GamesSection from "../ui/components/homepage/GamesSection"
import ManualSection from "../ui/components/homepage/ManualSection"
import BurnSection from "../ui/components/homepage/BurnSection"
import MediaSection from "../ui/components/homepage/MediaSection"
import EnterSection from "../ui/components/homepage/EnterSection"
import NewNavbar from "../ui/components/homepage/NewNavbar"
import NewFooter from "../ui/components/homepage/NewFooter"

import styles from "../styles/Home.module.css"


function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <NewNavbar />
        <HeroSection />
        <GamesSection />
        <ManualSection />
        <BurnSection />
        <MediaSection />
        <EnterSection />
        <NewFooter />
      </main>
    </div>
  )
}

export default HomePage
