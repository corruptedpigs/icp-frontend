"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ModalTimeIsUp from "./games/modalTimeIsUp"

const GameTimer = ({ seconds }) => {
  const timerElapsedColour = "bg-gray-900";
  const [activeHr, setActiveHr] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nrOfPills = 11;
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHr(prev => prev + 1);
    }, seconds * 1000 / nrOfPills);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsModalOpen(true);
    }, seconds * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [seconds, nrOfPills]);

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // redirects to /games only on prod so that we can more easily develop the UI
    if(process.env.NODE_ENV === 'production') {
      router.push('/games');
    }
  };

  return (
    <>
      <ModalTimeIsUp isOpen={isModalOpen} onClose={handleCloseModal} message="Time is up" />

      <ul className="timeline timeline-thicker mx-auto timeline-vertical max-w-screen-lg" id="roadmap">
        <li className="h-20">
          <hr className={`${activeHr > 0 ? timerElapsedColour : "bg-green-600 glow"}`} />
        </li>
        <li>
          <hr className={`${activeHr > 1 ? timerElapsedColour : "bg-green-500 glow"}`} />
          <div className="timeline-end h-20"></div>
          <hr className={`${activeHr > 2 ? timerElapsedColour : "bg-green-400 glow"}`} />
        </li>
        <li>
          <hr className={`${activeHr > 3 ? timerElapsedColour : "bg-amber-500 glow"}`} />
          <div className="timeline-end h-20"></div>
          <hr className={`${activeHr > 4 ? timerElapsedColour : "bg-amber-400 glow"}`} />
        </li>
        <li >
          <hr className={`${activeHr > 5 ? timerElapsedColour : "bg-orange-500 glow"}`} />
          <div className="timeline-end h-20"></div>
          <hr className={`${activeHr > 6 ? timerElapsedColour : "bg-orange-900 glow"}`} />
        </li>
        <li>
          <hr className={`${activeHr > 7 ? timerElapsedColour : "bg-red-800 glow"}`} />
          <div className="timeline-end h-20"></div>
          <hr className={`${activeHr > 8 ? timerElapsedColour : "bg-red-700 glow"}`} />
        </li>
        <li>
          <hr className={`${activeHr > 9 ? timerElapsedColour : "bg-red-600 glow"}`} />
          <div className="timeline-end h-20"></div>
          <hr className={`${activeHr > 10 ? timerElapsedColour : "bg-red-500 glow"}`} />
        </li>

        <div className="timeline-middle">
          <Image src="/logo.png"
            alt="corrupted pigs logo"
            className=""
            height={100}
            width={100}
            priority
          />
        </div>
      </ul>
    </>
  )
}

export default GameTimer;
