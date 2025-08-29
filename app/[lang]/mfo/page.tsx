// app/[lang]/mfo/page.tsx
import { Metadata } from "next";
import MfoPageClient from "../../components/MfoPageClient";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { getPageDates } from "@/app/services/PageDatesService";
import { getMFOs } from "@/app/services/mfosService";
import authorsService from "@/app/services/authorsService";
import { FaqsService } from "@/app/services/FaqService";
import settingsService from "@/app/services/settingsService";
import { MfoPageStructuredData } from "@/app/structured-data/MfoPageStructuredData";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const t = await getTranslations({ locale: lang, namespace: "Metadata" });
	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"mfo_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}
	return {
		title: getAllSettings?.settings.mfo_page_meta_title || t("home.title"),
		description:
			getAllSettings?.settings.description || t("home.description"),
		keywords: [
			"МФО Украина",
			"отзывы МФО",
			"рейтинг микрофинансовых организаций",
			"лучшие МФО",
			"взять займ онлайн",
		],
		openGraph: {
			title: t("home.title"),
			description: t("home.description"),
			url: "https://mfoxa.com.ua/mfo",
			siteName: "Займи.ру",
			type: "website",
		},
	};
}

export default async function MfoPage({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ count?: string }>;
}) {
	const { lang } = await params;
	const { count } = await searchParams;
	const visibleCount = count ? parseInt(count, 10) : 10;

	// Получение переводов
	const mfoT = await getTranslations({ locale: lang, namespace: "MfoPage" });
	const ratingsT = await getTranslations({
		locale: lang,
		namespace: "RatingDisplay",
	});

	// Определение мобильного устройства
	const headersList = await headers();
	const userAgent = headersList.get("user-agent") || "";
	const parser = new UAParser(userAgent);
	const isMobile = parser.getDevice().type === "mobile";

	const dates = await getPageDates({ type: "mfo" });

	const data = await getMFOs({ lang: lang === "ua" ? "uk" : "ru" });
	const randomAuthor = await authorsService.getRandomAuthor(
		lang === "ua" ? "uk" : "ru"
	);
	const faqs = await FaqsService.getFaqs({ page_name: "reviews" });
	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"mfo_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}

	return (
		<>
			<MfoPageStructuredData
				lang={lang as "ru" | "ua"}
				data={data}
				dates={dates}
				randomAuthor={randomAuthor}
				faqs={faqs}
				getAllSettings={getAllSettings}
			/>
			<MfoPageClient
				randomAuthor={randomAuthor}
				getAllSettings={getAllSettings}
				faqs={faqs}
				dates={dates}
				data={data}
				translations={{ mfo: mfoT, ratings: ratingsT }}
				visibleCount={visibleCount}
				isMobile={isMobile}
				locale={lang}
			/>
		</>
	);
}
