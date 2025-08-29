// app/structured-data/ReviewsStructuredData.tsx
import Script from "next/script";
import { ReviewStatisticsResponse } from "@/app/services/reviewService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { AuthorRandomResponse } from "@/app/services/authorsService";
import { FaqsResponse } from "@/app/services/FaqService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type ReviewsStructuredDataProps = {
  lang: "ru" | "ua";
  stats: ReviewStatisticsResponse;
  dates: PageDatesResponse;
  randomAuthor: AuthorRandomResponse;
  faqs: FaqsResponse;
  getAllSettings: SettingsGroupResponse | undefined;
};

export const ReviewsStructuredData = ({ 
  lang, 
  stats, 
  dates, 
  randomAuthor, 
  faqs, 
  getAllSettings 
}: ReviewsStructuredDataProps) => {
  // WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: getAllSettings?.settings.reviews_page_title || "Отзывы об МФО Украины",
    description: getAllSettings?.settings.reviews_page_description || "Читайте отзывы клиентов о микрофинансовых организациях Украины",
    url: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}/reviews`,
    datePublished: dates.date_published,
    dateModified: dates.date_modified,
    author: {
      "@type": "Person",
      name: randomAuthor?.data?.name || "Эксперт MFoxa"
    },
    publisher: {
      "@type": "Organization",
      name: "MFoxa",
      url: "https://mfoxa.com.ua"
    }
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://mfoxa.com.ua"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === 'ru' ? 'Отзывы' : 'Відгуки',
        item: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}/reviews`
      }
    ]
  };

  // ItemList schema for reviews statistics
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Статистика отзывов МФО Украины",
    description: `Общая статистика: ${stats.total_mfos} компаний, ${stats.total_reviews} отзывов`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Количество компаний МФО",
        item: {
          "@type": "QuantitativeValue",
          value: stats.total_mfos,
          unitText: "компаний"
        }
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Общее количество отзывов",
        item: {
          "@type": "QuantitativeValue",
          value: stats.total_reviews,
          unitText: "отзывов"
        }
      }
    ]
  };

  // FAQPage schema if FAQs exist
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null;

  // Review schema for page rating
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: randomAuthor?.data?.name || "Эксперт MFoxa"
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1"
    },
    itemReviewed: {
      "@type": "WebPage",
      name: getAllSettings?.settings.reviews_page_title || "Отзывы об МФО Украины"
    }
  };

  // AggregateRating schema for overall reviews
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "WebPage",
      name: "Отзывы об МФО Украины"
    },
    ratingCount: stats.total_reviews,
    reviewCount: stats.total_reviews,
    bestRating: "5",
    worstRating: "1"
  };

  // Combine all schemas
  const allSchemas: object[] = [
    webPageSchema,
    breadcrumbSchema,
    itemListSchema,
    reviewSchema,
    aggregateRatingSchema
  ];

  // Add FAQ schema if available
  if (faqSchema) {
    allSchemas.push(faqSchema);
  }

  return (
    <>
      {allSchemas.map((schema, index) => (
        <Script
          key={index}
          id={`reviews-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
};
