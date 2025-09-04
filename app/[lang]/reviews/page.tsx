// app/[lang]/reviews/page.tsx
import { Metadata } from "next";
import ReviewsClient from "@/app/components/ReviewsPage";
import { getTranslations } from "next-intl/server";
import authorsService from "@/app/services/authorsService";
import { getReviewStatistics } from "@/app/services/reviewService";
import { FaqsService } from "@/app/services/FaqService";
import settingsService from "@/app/services/settingsService";
import { ReviewsStructuredData } from "@/app/structured-data/ReviewsStructuredData";
import { getPageDates } from "@/app/services/PageDatesService";

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
			"reviews_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}
	return {
		title:
			getAllSettings?.settings.reviews_page_meta_title ||
			t("reviewss.title") ||
			"Отзывы об МФО Украины — Честные мнения клиентов",
		description:
			getAllSettings?.settings.reviews_page_meta_description ||
			t("reviewss.description") ||
			"Читайте отзывы клиентов о микрофинансовых организациях Украины. Реальный опыт, оценки и советы от заемщиков.",
		keywords: [
			"отзывы МФО",
			"МФО Украина",
			"займы онлайн",
			"мнение клиентов",
		],
		openGraph: {
			title: t("reviewss.title") || "Отзывы об МФО Украины",
			description:
				t("reviewss.description") ||
				"Узнайте, что говорят клиенты о микрокредитных компаниях Украины.",
			url: "https://mfoxa.com.ua/reviews",
			type: "website",
		},
	};
}

export default async function ReviewsPageWrapper({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ count?: string; sort?: string }>;
}) {
	const { lang } = await params;
	const { count, sort } = await searchParams;
	const reviewsCount = count ? parseInt(count, 10) : 16;

	const randomAuthor = await authorsService.getRandomAuthor(
		lang === "ua" ? "uk" : "ru"
	);
	const stats = await getReviewStatistics();
	const faqs = await FaqsService.getFaqs({ page_name: "reviews" });
	const dates = await getPageDates({ type: "reviews" });
	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"reviews_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}

	return (
		<>
			<ReviewsStructuredData
				lang={lang as "ru" | "ua"}
				dates={dates}
				getAllSettings={getAllSettings}
			/>
			<ReviewsClient
				stats={stats}
				getAllSettings={getAllSettings}
				faqs={faqs}
				randomAuthor={randomAuthor}
				locale={lang}
				reviewsCount={reviewsCount}
				selectedSortKey={sort || ""}
			/>
		</>
	);
}
