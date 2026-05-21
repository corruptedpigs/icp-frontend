"use client";

import { useState } from 'react';
import Image from 'next/image';

const Player1 = ({ images, nfts }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // Support both plain image array and full nft objects array.
  // Use the image URL as a stable unique ID since nft objects have no explicit id.
  const cards = nfts ?? images.map(src => ({ image: src, burnPower: null, name: null }));

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const selectedCards = cards.filter(c => selectedIds.includes(c.image));
  const totalPower = selectedCards.reduce((sum, c) => sum + (c.burnPower ?? 0), 0);

  const getTier = (power) => {
    if (power < 10) return '1-9';
    if (power <= 20) return '10-20';
    if (power <= 30) return '21-30';
    return '31+';
  };

  return (
    <div id="squad-selection" className="flex flex-col items-center w-full max-w-5xl mx-auto pt-8 pb-8 gap-8">

      {/* Header */}
      <div id="squad-header" className="text-center space-y-1">
        <h2 className="font-bold text-4xl uppercase tracking-widest text-pink-400 drop-shadow-[0_0_10px_rgba(255,51,187,0.)]">
          SELECT YOUR SQUAD
        </h2>
        <p className="text-sm uppercase tracking-widest text-neutral-200 font-weight-medium">
          Pick 3 cards to place on the table
        </p>
      </div>

      {/* Card grid */}
      <div id="squad-card-grid" className="flex flex-wrap justify-center gap-12">
        {cards.map((card, index) => {
          const id = card.image;
          const isSelected = selectedIds.includes(id);
          const isDisabled = selectedIds.length >= 3 && !isSelected;

          return (
            <div
              key={index}
              id={`nft-card-${index}`}
              onClick={() => !isDisabled && toggleSelect(id)}
              className={[
                'nft-card relative w-40 h-60 rounded-xl overflow-hidden',
                'bg-black border-2 transition-all duration-200',
                isSelected
                  ? 'nft-card--selected -translate-y-4 border-pink-500 ring-4 ring-pink-500 shadow-[0_0_30px_rgba(255,51,187,0.8)] cursor-pointer'
                  : isDisabled
                  ? 'nft-card--disabled border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 cursor-pointer hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(255,51,187,0.6)]',
              ].join(' ')}
            >
              {/* Full NFT image — fills the entire card, no cropping */}
              {card.image && (
                <div className="nft-card__image absolute inset-0">
                  <Image
                    src={card.image}
                    fill
                    className="object-contain"
                    alt="NFT"
                    sizes="160px"
                  />
                </div>
              )}

              {/* Burn power badge — overlaid at the bottom, transparent background */}
              {card.burnPower !== null && card.burnPower !== undefined && (
                <div className="nft-card__burn-badge absolute bottom-0 left-0 right-0 flex justify-center pb-2 pt-6 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full border border-yellow-400/30">
                    {/* Flame icon */}
                    <svg
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1 0 12.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <span className="text-lg font-bold text-yellow-400 leading-none">
                      {card.burnPower}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div id="squad-controls" className="flex flex-col items-center gap-4">
        {selectedIds.length === 3 && (
          <div id="squad-tier-display" className="bg-black/50 border border-yellow-400/50 px-6 py-2 rounded-lg text-center">
            <span className="font-bold text-yellow-400 block uppercase tracking-widest">
              YOUR TIER: {totalPower}
            </span>
            <span className="text-xs text-gray-400">
              Matched against Tier {getTier(totalPower)}
            </span>
          </div>
        )}

        <button
          id="squad-lock-btn"
          disabled={selectedIds.length !== 3}
          className="btn btn-warning text-xl font-bold uppercase tracking-widest px-10 h-14 disabled:opacity-40"
        >
          LOCK IN SELECTION
        </button>
      </div>

    </div>
  );
};

export default Player1;
