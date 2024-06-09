import Image from "next/image";

const GameTimer = () => {
  return (
    <ul className="timeline mx-auto timeline-vertical max-w-screen-lg">
      <li>
        <div className="timeline-middle">
          <Image src="/logo.png"
            alt="corrupted pigs logo"
            className=""
            height={50}
            width={50}
            priority
          />
        </div>

        <hr className="bg-red-700 glow hr_thicker"/>
      </li>
      <li>
        <hr className="bg-orange-700 glow hr_thicker"/>

        <hr className="bg-orange-600 glow hr_thicker"/>
      </li>
      <li>
        <hr/>
        <hr/>
      </li>
      <li>
        <hr/>
        <hr/>
      </li>
      <li>
        <hr/>
        <hr/>
      </li>
      <li>
        <hr/>
      </li>
    </ul>
  )
}

export default GameTimer;
