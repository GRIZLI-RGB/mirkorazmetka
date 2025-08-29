'use client';
import React from 'react';

interface Company {
  name: string;
  url: string;
  ratingValue: number;
  reviewCount: number;
  position: number;
}

interface Props {
  companies: Company[];
}

export const MfoListStructuredData: React.FC<Props> = ({ companies }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: companies.map((company) => ({
      "@type": "ListItem",
      position: company.position,
      url: company.url,
      name: company.name,
      "aggregateRating": {
        "@type": "AggregateRating",
        ratingValue: company.ratingValue,
        reviewCount: company.reviewCount,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
