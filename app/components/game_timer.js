"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const GameTimer = () => {

  const [activeHr, setActiveHr] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHr(prev => prev + 1);
    }, (15/11)*1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 15000);

    return () => clearInterval(interval);
  }, [])

  return (
    <ul className="timeline timeline-thicker mx-auto timeline-vertical max-w-screen-lg" id="roadmap">
      <li className="h-20">
        <div className="timeline-middle">
          <Image src="/logo.png"
            alt="corrupted pigs logo"
            className=""
            height={50}
            width={50}
            priority
          />
        </div>

        <hr className={`${activeHr > 0 ? '' : "bg-green-600 glow"}`}/>
      </li>
      <li>
        <hr className={`${activeHr > 1 ? '' : "bg-green-500 glow"}`}/>
        <div className="timeline-end h-20"></div>
        <hr className={`${activeHr > 2 ? '' : "bg-green-400 glow"}`}/>
      </li>
      <li>
        <hr className={`${activeHr > 3 ? '' : "bg-amber-500 glow"}`}/>
        <div className="timeline-end h-20"></div>
        <hr className={`${activeHr > 4 ? '' : "bg-amber-400 glow"}`}/>
      </li>
      <li >
        <hr className={`${activeHr > 5 ? '' : "bg-orange-500 glow"}`}/>
        <div className="timeline-end h-20"></div>
        <hr className={`${activeHr > 6 ? '' : "bg-orange-900 glow"}`}/>
      </li>
      <li>
        <hr className={`${activeHr > 7 ? '' : "bg-red-800 glow"}`}/>
        <div className="timeline-end h-20"></div>
        <hr className={`${activeHr > 8 ? '' : "bg-red-700 glow"}`}/>
      </li>
      <li>
        <hr className={`${activeHr > 9 ? '' : "bg-red-600 glow"}`}/>
        <div className="timeline-end h-20"></div>
        <hr className={`${activeHr > 10 ? '' : "bg-red-500 glow"}`}/>
      </li>
    </ul>
  )
}

export default GameTimer;
