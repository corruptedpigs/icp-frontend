"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';

const GameTimer = () => { 

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

        <hr className="bg-green-600 glow"/>
      </li>
      <li>
        <hr className="bg-green-500 glow"/>
        <div className="timeline-end h-20"></div>
        <hr className="bg-green-400 glow"/>
      </li>
      <li>
        <hr className="bg-amber-500	glow"/>
        <div className="timeline-end h-20"></div>
        <hr className="bg-amber-400 glow"/>
      </li>
      <li >
        <hr className="bg-orange-500 glow"/>
        <div className="timeline-end h-20"></div>
        <hr className="bg-orange-900 glow"/>
      </li>
      <li>
        <hr className="bg-red-800 glow"/>
        <div className="timeline-end h-20"></div>
        <hr className="bg-red-700 glow"/>
      </li>
      <li>
        <hr className="bg-red-600 glow"/>
        <div className="timeline-end h-20"></div>
        <hr className="bg-red-500 glow"/>
      </li>
    </ul>
  )
}

export default GameTimer;
