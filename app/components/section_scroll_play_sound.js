'use client';

import { useEffect, useRef } from 'react';
import SoundPlayer from './sound_player';
import debounce from 'lodash.debounce';

const SectionScrollPlaySound = ({ id, soundUrl, css, children }) => {
  const sectionRef = useRef(null);
  const audioRef = useRef(new Audio(soundUrl)); // Initialize audioRef with the provided sound URL

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (sectionRef.current) {
        const { top } = sectionRef.current.getBoundingClientRect();
        if (top <= window.innerHeight && top >= 0) {
          // Play sound when the top of the section is in view
          audioRef.current.play();
        }
      }
    }, 100); // Adjust debounce delay as needed

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  return (
    <section id={id} ref={sectionRef} className={css}>
      {children}
      <SoundPlayer soundUrl={soundUrl} />
    </section>
  );
};

export default SectionScrollPlaySound;
