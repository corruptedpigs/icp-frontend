import Link from 'next/link';

function ChooseGameCard({ bg_image_path, title, blurred = false, link = '#' }) {
  const cardContent = (
    <div className={`card xs:w-32 md:w-auto image-full shadow-xl shadow-cyan-700 ${blurred ? 'blur-sm' : ''}`}>
      <figure>
        <img src={bg_image_path} alt={`${title} Game`} />
      </figure>
      <div className="card-body items-center uppercase">
        <h2 className="card-title text-4xl font-mono italic font-bold pt-16 ">{title}</h2>
      </div>
    </div>
  );

  return blurred ? cardContent : (
    <Link href={link}>
      {cardContent}
    </Link>
  );
}

export default ChooseGameCard;
