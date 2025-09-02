// app/[lang]/page.tsx
import { Metadata } from "next";
import FinancialMarketplace from "../components/Home/FinancialMarketplace";
import BestLoans from "../components/Home/BestLoans";
import { TopUkrMFO } from "../components/Home/TopUkrMFO";
import { LastReviews } from "../components/Home/LastRewiews";
import DetailsText from "../components/DetailsText";
import Questions from "../components/Home/Questions";
import { getTranslations } from "next-intl/server";
import { getHomeData, LangType } from "../services/HomeService";
import { MicrodataHome } from "../structured-data/MicrodataHome";
import settingsService from "../services/settingsService";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;

	const getAllSettingsMeta = await settingsService.getSettingsByGroup(
		"seo",
		lang === "ua" ? "uk" : "ru"
	);
	const t = await getTranslations({ locale: lang, namespace: "Metadata" });

	return {
		title:
			getAllSettingsMeta.settings.main_page_meta_title || t("home.title"),
		description:
			getAllSettingsMeta.settings.main_page_meta_description ||
			t("home.description"),
		keywords: [
			"займы онлайн",
			"МФО Украина",
			"рейтинг микрофинансовых организаций",
			"срочные займы",
			"деньги в долг",
		],
		openGraph: {
			title: t("home.title"),
			description: t("home.description"),
			url: "https://mfoxa.com.ua",
			images: [
				{
					url: "https://mfoxa.com.ua/og-main.jpg",
					width: 1200,
					height: 630,
					alt: t("home.title"),
				},
			],
		},
		alternates: {
			canonical: "https://mfoxa.com.ua",
		},
	};
}

export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	const homeData = await getHomeData(lang as LangType);
	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"seo",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}
	return (
		<>
			<MicrodataHome locale={lang as "ru" | "ua"} homeData={homeData} />
			<div>
				<FinancialMarketplace
					locale={lang}
					settings={getAllSettings?.settings}
				/>
				<BestLoans best_credits={homeData.best_credits} />
				<TopUkrMFO top_mfos={homeData.top_mfos} />
				<LastReviews recent_reviews={homeData.recent_reviews} />
				<DetailsText html={getAllSettings?.settings.main_page_text} />
				<Questions />
			</div>
		</>
	);
}
