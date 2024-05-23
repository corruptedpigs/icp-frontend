"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";

const CtaGoogleAnalytics = ({ buttonText, buttonClass, url, ctaLabel }) => {
  const router = useRouter();

  const trackClick = (cta) => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'CTA Clicks',
        event_label: cta,
        value: '1'
      });
    }
  };

  const handleCTAClick = (e) => {
    e.preventDefault();
    trackClick(ctaLabel);
    router.push(url);
  };

  return (
    <Link href={url} className={buttonClass} onClick={handleCTAClick}>
      {buttonText}
    </Link>
  );
};

export default CtaGoogleAnalytics;
