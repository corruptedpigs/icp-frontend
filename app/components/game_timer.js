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
    <div className="h-full pt-24 pb-6">
      <ModalTimeIsUp isOpen={isModalOpen} onClose={handleCloseModal} message="Time is up" />

      <ul className="timeline timeline-responsive timeline-thicker timeline-vertical">
        {Array.from({ length: nrOfPills }, (_, i) => (
          <li key={i} className="flex-1">
            <hr className={`${activeHr <= i ? getColor(i) + " glow" : timerElapsedColour}`} />
          </li>
        ))}

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
    </div>
  )
}

const getColor = (index) => {
  const colors = [
    "bg-green-600", "bg-green-500", "bg-green-400",
    "bg-amber-500", "bg-amber-400",
    "bg-orange-500", "bg-orange-900",
    "bg-red-800", "bg-red-700", "bg-red-600", "bg-red-500"
  ];
  return colors[index] || "bg-gray-400";
};

export default GameTimer;
