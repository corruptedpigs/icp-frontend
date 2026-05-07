"use client";

import { useState } from 'react';
import Image from 'next/image';

const NFTGalleryCard = ({ src, burnPower, onSelect, canSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    if (!isSelected && canSelect) {
      setIsSelected(true);
      onSelect(src);
    }
  };

  return (
    <div
      id={`nft-card-${src?.split('/').pop()?.split('.')[0] ?? 'unknown'}`}
      className={`relative cursor-pointer flex flex-col items-center ${isSelected ? 'blur-sm' : ''}`}
      onClick={handleClick}
    >
      <Image
        src={src}
        width={100}
        height={200}
        className={`transition-transform duration-400 ${isSelected ? '' : 'hover:scale-90'}`}
        alt="NFT Image"
      />

      {/* Burn power badge — shown when burnPower is available */}
      {burnPower !== null && burnPower !== undefined && (
        <div className="mt-2 flex items-center justify-center gap-1 bg-black/50 px-3 py-1 rounded-full border border-yellow-400/30">
          {/* Flame icon */}
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1 0 12.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
          </svg>
          <span className="text-xl text-yellow-400 font-bold tracking-wide leading-none">
            {burnPower}
          </span>
        </div>
      )}
    </div>
  );
};

export default NFTGalleryCard;
