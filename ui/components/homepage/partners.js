import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Partners = () => {
  return (
    <section id="partners" className='hero bg-slate-900'>
      <div className="hero-content">
        <div className="lg:flex lg:justify-between">
          <Image src="/images/partners/Polygon_Primary_Light.svg" height={90} width={130} />
        </div>
      </div>
    </section>
  )
}

export default Partners;
