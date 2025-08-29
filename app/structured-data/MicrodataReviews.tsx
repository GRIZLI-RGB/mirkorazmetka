// app/structured-data/MicrodataReviews.tsx
import Script from "next/script";
import { ReviewsApiResponse } from "@/app/services/reviewService";

type MicrodataReviewsProps = {
  reviewsData: ReviewsApiResponse | null;
  companyName: string;
  companySlug: string;
  locale: "ru" | "ua";
};

export const MicrodataReviews = ({
  reviewsData,
  companyName,
  companySlug,
  locale,
}: MicrodataReviewsProps) => {
  if (
    !reviewsData ||
    !reviewsData.data ||
    !Array.isArray(reviewsData.data) ||
    reviewsData.data.length === 0
  )
    return null;

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviewsData.data.map((review, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author_name || "Аноним",
        },
        datePublished: review.created_at,
        reviewBody: review.review_text,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating || 0,
          bestRating: 5,
          worstRating: 1,
        },
        itemReviewed: {
          "@type": "FinancialService",
          name: companyName,
          url: `https://mfoxa.com.ua/${locale}/mfo/${companySlug}`,
        },
        ...(review.admin_response && {
          comment: {
            "@type": "Comment",
            text: review.admin_response,
            author: {
              "@type": "Organization",
              name: review.admin_response_author || companyName,
            },
          },
        }),
      },
    })),
  };

  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "FinancialService",
      name: companyName,
      url: `https://mfoxa.com.ua/${locale}/mfo/${companySlug}`,
    },
    ratingValue: reviewsData.mfo?.rating_average || 0,
    reviewCount: reviewsData.mfo?.rating_count || 0,
    bestRating: 5,
    worstRating: 1,
  };

  return (
    <>
      <Script id="reviews-schema" type="application/ld+json">
        {JSON.stringify(reviewsSchema, null, 2)}
      </Script>
      <Script id="aggregate-rating-schema" type="application/ld+json">
        {JSON.stringify(aggregateRatingSchema, null, 2)}
      </Script>
    </>
  );
};
