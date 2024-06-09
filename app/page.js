/* eslint-disable @next/next/no-img-element */

'use client';

import InstitutionsMarquee from '../ui/components/homepage/institutions_marquee';
import Hero from "../ui/components/homepage/hero"
import Hero2 from "../ui/components/homepage/hero2"
import Partners from "../ui/components/homepage/partners"
import NFCBanner from "../ui/components/homepage/nfc_banner"
import Associations from "../ui/components/homepage/associations"
import Accordion from "../ui/components/homepage/accordion"
import Roadmap from "../ui/components/homepage/roadmap"
import Footer from "../ui/components/homepage/footer"

import styles from "../styles/Home.module.css"
import ToggleMuteButton from "./components/toggle_mute_button";


function HomePage() {
  return (
    <div className={styles.container}>
      <div className="fixed top-14 lg:top-12 right-4 lg:left-4">
        <ToggleMuteButton />
      </div>

      <main className={styles.main}>
        {/* this marquee is currently hidden as per Eddie's instructions. */}
        {/* <InstitutionsMarquee/> */}

        <div className="bg-violet">
          <Hero/>
        </div>
        <Hero2/>
        <Partners/>
        <Roadmap/>
        <Associations/>

        {/* <NFCBanner/> */}

        <Accordion/>
        <hr className="bg-purple glow"/>
        <Footer/>
      </main>
    </div>
  )
}

export default HomePage
