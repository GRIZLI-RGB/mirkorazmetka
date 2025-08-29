// app/structured-data/PageReview.tsx
import Script from "next/script";
import { AuthorRandomResponse } from "@/app/services/authorsService";

type PageReviewProps = {
  author: AuthorRandomResponse;
  pageName: string;
  rating?: number;
};

export const PageReview = ({ author, pageName, rating = 5 }: PageReviewProps) => {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: author?.data?.name || "Эксперт MFoxa"
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: rating.toString(),
      bestRating: "5",
      worstRating: "1"
    },
    itemReviewed: {
      "@type": "WebPage",
      name: pageName
    },
    reviewBody: `Отзыв о странице ${pageName} от эксперта ${author?.data?.name || "MFoxa"}`,
    datePublished: new Date().toISOString()
  };

  return (
    <Script
      id="page-review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema, null, 2) }}
    />
  );
};
