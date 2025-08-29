// app/structured-data/MicrodataLoanCatalog.tsx
import Script from "next/script";
import { GetCatalogListResponse } from "@/app/services/catalogService";

type MicrodataLoanCatalogProps = {
  data: GetCatalogListResponse;
  locale: "ru" | "ua";
  slug?: string;
};

export const MicrodataLoanCatalog = ({ data, locale, slug }: MicrodataLoanCatalogProps) => {
  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: slug ? `Займы ${slug}` : "Займы онлайн",
    itemListElement: data.data.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "FinancialService",
        name: item.button_name,
        url: `https://mfoxa.com.ua/${locale}/mfo/${item.slug}`,
        
      },
    })),
  };

  return (
    <Script id="loan-catalog-schema" type="application/ld+json">
      {JSON.stringify(catalogSchema, null, 2)}
    </Script>
  );
};