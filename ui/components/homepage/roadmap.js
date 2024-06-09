import Image from "next/image";
import SectionScrollPlaySound from '../../../app/components/section_scroll_play_sound'

const Roadmap = () => {
  const pig_sounds = [
    "/sounds/02.ogg",
    "/sounds/03.ogg",
    "/sounds/05.ogg"
  ]

  return (
    <SectionScrollPlaySound id="roadmap" css="bg-violet py-10 md:py-16" soundUrls={pig_sounds} >
      <div style={{ backgroundImage: "url('/TRADER-2-faded.png')", backgroundSize: "380px", backgroundPosition: 'bottom left', backgroundRepeat: "no-repeat" }}>

        <h2 className="text-4xl font-bold mb-8 text-center text-neutral-content">Roadmap</h2>
        <div className="hero mx-auto px-4 text-neutral-content">
          <div className="hero-overlay custom-hero-overlay"></div>

          <ul className="timeline mx-auto timeline-vertical max-w-screen-lg">
            <li>
              <div className="timeline-start md:timeline-end timeline-date">Q1 2024</div>
              <div className="timeline-middle">
                <Image src="/logo.png"
                  alt="corrupted pigs logo"
                  className=""
                  height={50}
                  width={50}
                  priority
                />
              </div>
              <div className="timeline-end md:timeline-start timeline-box bg-transparent">
                <dl>
                  <dt className="underline">Project Conceptualization</dt>
                  <dd>Define on which blockchain the NFTs will be deployed</dd>

                  <dt className="underline">Team Structure</dt>
                  <dd>Recruit key team members, including developers, designers, and community managers.</dd>
                </dl>
              </div>
              <hr className="bg-red-700 glow hr_thicker" />
            </li>
            <li>
              <hr className="bg-orange-700 glow hr_thicker" />
              <div className="timeline-start timeline-date">Q2 2024</div>
              <div className="timeline-end timeline-box bg-transparent">
                <dl>
                  <dt className="underline">Project Conceptualization</dt>
                  <dd>Finalize game mechanics and NFT design.</dd>

                  <dt className="underline">Community Building</dt>
                  <dd>Launch social media channels and engage early adopters.</dd>
                </dl>
              </div>
              <hr className="bg-orange-600 glow hr_thicker" />
            </li>
            <li>
              <hr />
              <div className="timeline-start md:timeline-end timeline-date">Q3 2024</div>
              <div className="timeline-end md:timeline-start timeline-box bg-transparent">
                <dl>
                  <dt className="underline">NFT Collection Launch</dt>
                  <dd>Release the first batch of Corrupted Pigs NFTs on the Polygon network.</dd>

                  <dt className="underline">Marketplace Integration</dt>
                  <dd>List NFTs on major NFT marketplaces for trading.</dd>

                  <dt className="underline">Smart Contract Development</dt>
                  <dd>Develop and test smart contracts for NFTs and in-game transactions.</dd>

                  <dt className="underline">Beta Game Launch</dt>
                  <dd>Release a beta version of the burning pigs game for selected players.</dd>
                </dl>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-start timeline-date">Q4 2024</div>
              <div className="timeline-end timeline-box bg-transparent">
                <dl>
                  <dt className="underline">Full Game Launch</dt>
                  <dd>Officially launch the Corrupted Pigs social game with full functionality.</dd>

                  <dt className="underline">Community Events</dt>
                  <dd>Host events and contests to boost engagement and reward participants.</dd>
                </dl>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-start md:timeline-end timeline-date">Q1 2025</div>
              <div className="timeline-end md:timeline-start timeline-box bg-transparent">
                <dl>
                  <dt className="underline">Exclusive Content</dt>
                  <dd>Release special NFTs and in-game items for top players and contributors.</dd>

                  <dt className="underline">Governance</dt>
                  <dd>Implement a community governance system for player input on future developments.</dd>

                  <dt className="underline">Partnerships</dt>
                  <dd>Form strategic partnerships with other blockchain projects and organizations.</dd>
                </dl>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-start timeline-date">Q2 2025</div>
              <div className="timeline-end timeline-box bg-transparent">
                <dl>
                  <dt className="underline">Continuous Updates</dt>
                  <dd>Regularly update the game with new features, content, and improvements.</dd>

                  <dt className="underline">Expansion</dt>
                  <dd>Explore opportunities for cross-game interoperability and additional blockchain integrations.</dd>

                  <dt className="underline">Sustainability Initiatives</dt>
                  <dd>Launch programs to support social and environmental causes through in-game activities.</dd>
                </dl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </SectionScrollPlaySound>
  )
}

export default Roadmap;
