"use client";

import { useState } from 'react';
import Image from 'next/image';

const NFTGalleryCard = ({ src, onSelect,  canSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    if (!isSelected &&  canSelect) {
      setIsSelected(true);
      onSelect(src); // Notify parent component
    }
  };

  return (
    <div
      className={`relative cursor-pointer ${isSelected ? 'blur-sm' : ''}`}
      onClick={handleClick}
    >
      <Image
        src={src}
        width={100}
        height={200}
        className={`transition-transform duration-400 ${isSelected ? '' : 'hover:scale-95'}`}
        alt="NFT Image"
      />
    </div>
  );
};

export default NFTGalleryCard;
