// app/structured-data/LoanStructuredData.tsx
import Script from "next/script";
import { GetCatalogListResponse } from "@/app/services/catalogService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { AuthorRandomResponse } from "@/app/services/authorsService";
import { FaqsResponse } from "@/app/services/FaqService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type LoanStructuredDataProps = {
  lang: "ru" | "ua";
  data: GetCatalogListResponse;
  dates: PageDatesResponse;
  randomAuthor: AuthorRandomResponse;
  faqs: FaqsResponse;
  getAllSettings: SettingsGroupResponse | undefined;
};

export const LoanStructuredData = ({ 
  lang, 
  data, 
  dates, 
  randomAuthor, 
  faqs, 
  getAllSettings 
}: LoanStructuredDataProps) => {
  // WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: getAllSettings?.settings.loan_page_title || "Займы онлайн - МФО Украины",
    description: getAllSettings?.settings.loan_page_description || "Получите займ онлайн от проверенных МФО Украины. Быстрое одобрение, выгодные условия, минимальные требования.",
    url: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}/loan`,
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
        name: lang === 'ru' ? 'Займы' : 'Позики',
        item: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}/loan`
      }
    ]
  };

  // ItemList schema for loan catalog
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Каталог займов МФО Украины",
    description: `Доступные займы от ${data.data.length} микрофинансовых организаций`,
    itemListElement: data.data.map((loan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: loan.meta_title || loan.h1_title || `Займ ${index + 1}`,
      item: {
        "@type": "LoanOrCredit",
        name: loan.meta_title || loan.h1_title || `Займ ${index + 1}`,
        description: loan.meta_description || loan.description_under_title || "Быстрый займ онлайн",
        provider: {
          "@type": "FinancialService",
          name: loan.meta_title || loan.h1_title || "МФО",
          url: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}/loan/${loan.slug}`
        },
        loanType: "Микрозайм",
        loanTerm: {
          "@type": "QuantitativeValue",
          unitText: "дней"
        },
        interestRate: {
          "@type": "QuantitativeValue",
          unitText: "% годовых"
        }
      }
    }))
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
      name: getAllSettings?.settings.loan_page_title || "Займы онлайн - МФО Украины"
    }
  };

  // Organization schema for MFoxa
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MFoxa",
    url: "https://mfoxa.com.ua",
    description: "Агрегатор займов и МФО Украины",
    logo: "https://mfoxa.com.ua/logo.png",
    sameAs: [
      "https://t.me/mfoxa_ua",
      "https://www.facebook.com/mfoxa.ua"
    ]
  };

  // Combine all schemas
  const allSchemas: object[] = [
    webPageSchema,
    breadcrumbSchema,
    itemListSchema,
    reviewSchema,
    organizationSchema
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
          id={`loan-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
};
