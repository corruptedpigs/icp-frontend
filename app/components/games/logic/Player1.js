"use client";

import { useState } from 'react';
import NFTGalleryCard from './../../NFTGalleryCard'; // Adjust the path as needed
import SelectedCardsColumn from './../../SelectedCardsColumn'; // Adjust the path as needed

const Player1 = ({ images }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const canSelect = selectedCards.length < 3;

  const handleSelect = (src) => {
    if (canSelect && !selectedCards.includes(src)) {
      setSelectedCards([...selectedCards, src]);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <a className="btn btn-ghost glass no-animation mb-4">Gallery</a>
        <div className="flex-1/3 flex flex-col hover:overflow-auto gap-4 scrollbar-hide">
          {images.map((src, index) => (
            <NFTGalleryCard key={index} src={src} onSelect={handleSelect} canSelect={canSelect} />
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <a className="btn btn-ghost glass no-animation mb-4">Player 1</a>
        <SelectedCardsColumn selectedCards={selectedCards} />
      </div>
      <div className="flex flex-col">
        <a className="btn btn-ghost glass no-animation mb-4">Your combination</a>
      </div>

      <div className="flex flex-col mx-4">

      </div>
    </>
  );
};

export default Player1;
