// import InstituitionsRollbar from './institutions_rollbar';
import Image from "next/image";
import Link from "next/link";

const NFCBanner = () => {
  return (
    <section id="nfc-side-event" style={ { backgroundColor: "rgb(200, 255, 0)", minHeight: "280px" } } className="py-10 px-10 md:py-20">
      <div className="flex flex-row-reverse  flex-wrap  container justify-center space-x-10 space-y-6">
        <div className="max-w-screen-lg space-y-6">
          <h2 className="text-5xl ">Show your pride in the Corrupted Pigs community!
          </h2>
          <p className="text-2xl">
            Our T-shirts are more than just merch — they&#39;re a statement.
          </p>
          <p className="text-2xl">
            Get yours today.
          </p>
          <Link
            className="btn btn-white btn-wide hover:animate-bounce"
            target="_blank"
            rel="noopener noreferrer"
            href="https://corruptedpigs.store">
              Check out our merch
          </Link>
        </div>

        <div>
          <h2 className="text-2xl text-slate-800">Support us at the</h2>
          <Link
            href={"https://www.nonfungibleconference.com/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              alt="NFC logo"
              width={300}
              height={300}
              src="https://assets-global.website-files.com/65ba6e2ae14c08958104a6a8/65ba6e2ae14c08958104a775_NFC_testing-content-_-graphics-06.webp"/>
            </Link>
        </div>

      </div>
    </section>
  )
}

export default NFCBanner;
