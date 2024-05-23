/* eslint-disable @next/next/no-img-element */

import InstitutionsMarquee from '../ui/components/homepage/institutions_marquee';
import Navbar from "../ui/components/homepage/navbar";
import Hero from "../ui/components/homepage/hero"
import Hero2 from "../ui/components/homepage/hero2"
import Partners from "../ui/components/homepage/partners"
import NFCBanner from "../ui/components/homepage/nfc_banner"
import Associations from "../ui/components/homepage/associations"
import Accordion from "../ui/components/homepage/accordion"
import Roadmap from "../ui/components/homepage/roadmap"
import Footer from "../ui/components/homepage/footer"

import styles from "../ui/styles/Home.module.css"

function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <InstitutionsMarquee/>
        <div style={{ backgroundImage: "url('/background-3.png')", backgroundSize: "cover", backgroundPosition: 'center' }}>
          <Navbar />
          <Hero/>
        </div>
        <Hero2/>
        <Partners/>
        <Associations/>
        <NFCBanner/>
        <Roadmap/>
        <Accordion/>
        <hr className="bg-purple glow"/>
        <Footer/>
      </main>
    </div>
  )
}

export default HomePage
