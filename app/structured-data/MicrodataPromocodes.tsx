// app/structured-data/MicrodataPromocodes.tsx
import Script from "next/script";

interface Promocode {
  id: number;
  title: string;
  description: string;
  valid_until: string;
  redirect_url: string;
  mfo: { name: string; logo_url: string };
}

type MicrodataPromocodesProps = {
  promocodes: Promocode[];
  companyName: string;
  companySlug: string;
  locale: "ru" | "ua";
};

export const MicrodataPromocodes = ({ promocodes, companyName, companySlug, locale }: MicrodataPromocodesProps) => {
  const promocodesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Промокоды ${companyName}`,
    itemListElement: promocodes.map((promo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: promo.title,
        description: promo.description,
        url: promo.redirect_url,
        validThrough: promo.valid_until,
        offeredBy: {
          "@type": "Organization",
          name: companyName,
          url: `https://mfoxa.com.ua/${locale}/mfo/${companySlug}`,
        },
      },
    })),
  };

  return (
    <Script id="promocodes-schema" type="application/ld+json">
      {JSON.stringify(promocodesSchema, null, 2)}
    </Script>
  );
};