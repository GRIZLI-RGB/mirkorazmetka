// app/structured-data/MicrodataLogin.tsx
import Script from "next/script";

type MicrodataLoginProps = {
  title: string;
  description: string;
  companyName: string;
  companySlug: string;
  locale: "ru" | "ua";
};

export const MicrodataLogin = ({ title, description, companyName, companySlug, locale }: MicrodataLoginProps) => {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: `https://mfoxa.com.ua/${locale}/mfo/${companySlug}/login`,
    about: {
      "@type": "FinancialService",
      name: companyName,
    },
  };

  return (
    <Script id="login-schema" type="application/ld+json">
      {JSON.stringify(webPageSchema, null, 2)}
    </Script>
  );
};