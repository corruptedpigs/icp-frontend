import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Partners = () => {
  return (
    <section id="partners" className='hero bg-slate-900'>
      <div className="hero-content">
        <div className="lg:flex lg:justify-between">
          <Image src="/images/partners/internet-computer-icp-logo.svg" height={60} width={130} />
          <pre className='uppercase text-white font-bold my-auto mx-6'>Internet computer</pre>
        </div>
      </div>
    </section>
  )
}

export default Partners;
