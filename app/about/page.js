
import Navbar from "../../ui/components/homepage/navbar";
import Avatar from "../components/avatar"
import Footer from "../../ui/components/homepage/footer"

export default function HomePage() {
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
  )
}
