import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const discordInviteLink = 'https://discord.gg/x6uJ65PpPj';

  return (
    <footer className="footer p-4 bg-violet text-neutral-content flex flex-col-reverse lg:flex-row justify-between">
      <nav className="mx-auto lg:w-1/3">
        <p className="text-sm font-bold">© 2024 Corrupted Pigs, All rights reserved.</p>
      </nav>
      <nav className="mx-auto lg:w-1/3 justify-center">
        <Image src="/logoBW.png" alt="logo B&W" height={90} width={100} className="invert-[.7]"/>
      </nav>
      <nav className="lg:w-1/3 flex flex-col items-center lg:items-end mx-auto">
        <h6 className="footer-title uppercase">Follow the Pigs</h6>
        <div className="flex justify-center items-center gap-4">
          <Link href="https://x.com/CorruptedPigs" className="text-white">
            <Image src="/x-logo.svg" alt="Pig card1" height={40} width={30}/>
          </Link>
          <Link href={discordInviteLink} className="text-white">
            <Image src="/discord-logo.svg" alt="Pig card1" height={40} width={40}/>
          </Link>
        </div>
      </nav>
    </footer>
  )
}

export default Footer;
