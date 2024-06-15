import Image from 'next/image';

const SelectedCardsColumn = ({ selectedCards }) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
      {selectedCards.map((src, index) => (
        <Image
          key={index}
          src={src}
          width={200}
          height={450}
          className="transition-transform duration-400"
          alt="Selected NFT Image"
        />
      ))}
    </div>
  );
};

export default SelectedCardsColumn;
