'use client'
import { usePathname } from "next/navigation";

type BreadcrumbListProps = {
  lang: "ru" | "ua";
};

const translations: Record<string, { ru: string; ua: string }> = {
  loan: { ru: "Займы", ua: "Позики" },
  mfo: { ru: "МФО", ua: "МФО" },
  reviews: { ru: "Отзывы", ua: "Відгуки" },
  contacts: { ru: "Контакты", ua: "Контакти" },
  promotion: { ru: "Акции", ua: "Акції" },
  qap: { ru: "Вопросы", ua: "Питання" },
  catalog: { ru: "Каталог МФО", ua: "Каталог МФО" },
};

export const BreadcrumbList = ({ lang }: BreadcrumbListProps) => {
  const pathname = usePathname();
  const segments = pathname ? pathname.split("/").filter(Boolean).slice(1) : [];
  const breadcrumbs = segments.map((segment, index) => {
    const href = `${lang === 'ru' ? '/ru' : ''}/${segments.slice(0, index + 1).join("/")}`.replace(/\/\/+/, '/');
    const label = translations[segment]?.[lang] || decodeURIComponent(segment);
    return { label, href };
  });

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ua" ? "Головна" : "Главная",
        item: `https://mfoxa.com.ua${lang === 'ru' ? '/ru' : ''}`,
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: `https://mfoxa.com.ua${crumb.href}`,
      })),
    ],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(breadcrumbList)}</script>
  );
};