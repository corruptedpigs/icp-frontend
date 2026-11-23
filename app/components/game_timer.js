"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import ModalTimeIsUp from "./games/modalTimeIsUp"

/**
 * Server-driven countdown. `deadline` is the move deadline in client-clock ms
 * (server `move_deadline_at` already adjusted by the clock offset). When it
 * elapses, `onExpire` (optional, async) asks the server for the real state and
 * may return a new `{ deadline }` to keep playing; otherwise "Time is up" shows.
 */
const GameTimer = ({ deadline, onExpire }) => {
  const timerElapsedColour = "bg-gray-900";
  const [current, setCurrent] = useState({ deadline, total: Math.max(0, deadline - Date.now()) });
  const [activeHr, setActiveHr] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nrOfPills = 11;
  const router = useRouter();
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // A new server deadline restarts the clock.
  useEffect(() => {
    setCurrent({ deadline, total: Math.max(0, deadline - Date.now()) });
  }, [deadline]);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      const remaining = current.deadline - Date.now();
      const elapsed = current.total ? 1 - remaining / current.total : 1;
      setActiveHr(Math.min(nrOfPills, Math.max(0, Math.floor(elapsed * nrOfPills))));
    };
    tick();
    const interval = setInterval(tick, 250);
    const timeout = setTimeout(async () => {
      clearInterval(interval);
      setActiveHr(nrOfPills);
      let next = null;
      try {
        next = await onExpireRef.current?.();
      } catch {
        next = null; // cannot confirm with the server: treat the time as up
      }
      if (cancelled) return;
      if (next?.deadline && next.deadline > Date.now()) {
        setCurrent({ deadline: next.deadline, total: next.deadline - Date.now() });
      } else {
        setIsModalOpen(true);
      }
    }, Math.max(0, current.deadline - Date.now()));

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [current, nrOfPills]);

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // Same in dev and prod; set NEXT_PUBLIC_TIME_UP_REDIRECT=off to stay on the page while developing the UI.
    if (process.env.NEXT_PUBLIC_TIME_UP_REDIRECT !== 'off') {
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
