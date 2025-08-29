'use client';
import React from 'react';

export const StructuredData = () => {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MFoxa",
    url: "https://mfoxa.com.ua",
    logo: "https://mfoxa.com.ua/logo.png",
    sameAs: [
      "https://www.facebook.com/yourcompany",
      "https://www.instagram.com/yourcompany"
    ]
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MFoxa",
    url: "https://mfoxa.com.ua",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mfoxa.com.ua/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
};
