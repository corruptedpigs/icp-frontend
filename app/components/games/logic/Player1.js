"use client";

import { useState } from 'react';
import NFTGalleryCard from './../../NFTGalleryCard'; // Adjust the path as needed
import SelectedCardsColumn from './../../SelectedCardsColumn'; // Adjust the path as needed

const Player1 = ({ images, nfts }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const canSelect = selectedCards.length < 3;

  // Support both plain image array and full nft objects array
  const cards = nfts ?? images.map(src => ({ image: src, burnPower: null }));

  const handleSelect = (src) => {
    if (canSelect && !selectedCards.includes(src)) {
      setSelectedCards([...selectedCards, src]);
    }
  };

  return (
    <div className='flex flex-1 pt-24 h-screen justify-around'>

      <div>
        <a className="btn btn-ghost glass no-animation mb-4">Gallery</a>
        <div className="flex-1/3 flex flex-col hover:overflow-auto gap-4 scrollbar-hide">
          {cards.map((card, index) => (
            <NFTGalleryCard
              key={index}
              src={card.image}
              burnPower={card.burnPower}
              onSelect={handleSelect}
              canSelect={canSelect}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col">
          <a className="btn btn-ghost glass no-animation mb-4">Player 1</a>
          <SelectedCardsColumn selectedCards={selectedCards} />
        </div>
      </div>

      <div>
        <div className="flex flex-col">
          <a className="btn btn-ghost glass no-animation mb-4">Your combination</a>
        </div>
      </div>
    </div>
  );
};

export default Player1;
