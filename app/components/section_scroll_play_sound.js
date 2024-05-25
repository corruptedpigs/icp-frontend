'use client';

import { useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useMute } from './mute_context';

const SectionScrollPlaySound = ({ id, soundUrls, css, children }) => {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const { isMuted } = useMute();

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (isMuted) return;

      if (sectionRef.current) {
        const { top } = sectionRef.current.getBoundingClientRect();

        // Play sound when the top of the section is in view
        if (top <= window.innerHeight && top >= 0) {
          if (audioRef.current && !audioRef.current.paused) {
            // Audio is currently playing, do not start a new sound
            return;
          }

          const randomId = Math.floor(Math.random() * soundUrls.length);
          const randomSoundUrl = soundUrls[randomId];

          audioRef.current = new Audio(randomSoundUrl);

          audioRef.current.play();
        }
      }
    }, 100); // Adjust debounce delay as needed

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [isMuted]);

  return (
    <section id={id} ref={sectionRef} className={css}>
      {children}
    </section>
  );
};

export default SectionScrollPlaySound;
