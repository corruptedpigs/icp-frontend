
import Navbar from "../../ui/components/homepage/navbar";
import Avatar from "../components/avatar"
import Footer from "../../ui/components/homepage/footer"

export default function HomePage() {
  return (
    <main>
      <div style={{ backgroundImage: "url('/background-3.png')", backgroundSize: "cover", backgroundPosition: 'center' }}>
        <Navbar show_logo={true} />
      </div>

      <section
        id="hero2"
        style={{
          backgroundImage: "url('/TRADER-2-faded.png')",
          backgroundSize: "380px",
          backgroundPosition: 'bottom left',
          backgroundRepeat: "no-repeat"
        }}
        className='hero bg-pig'
      >
        <div className="hero-overlay custom-hero-overlay"></div>
        <div className="hero-content text-neutral-content py-12 max-w-screen-xl">
          <div className="flex flex-col items-center">
            <h1 className="mb-14 text-4xl font-bold">The Team</h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Avatar name="Henrik Kinell" role="CEO" src="/images/team/henrik.png"/>
              <Avatar name="Nuno Costa" role="CTO"  src="/images/team/ncosta.webp"/>
              <Avatar name="Tiago Quintans" role="COO" src="/images/team/tiago.webp"/>
              <Avatar name="Nuno Amiar" role="CMO" src="/images/team/amiar.webp"/>
              <Avatar name="Eddie Nes" role="NFT Artist" src="/images/team/eddie.webp"/>
              <Avatar name="Henrique Costa" role="Full stack developer" src="/images/team/henrique.jpeg"/>
              <Avatar name="Luis Damiao" role="Web Designer" src="/images/team/luis.webp"/>
            </div>
          </div>
        </div>
      </section>

      <hr className="bg-purple glow"/>
      <Footer/>
    </main>
  )
}
