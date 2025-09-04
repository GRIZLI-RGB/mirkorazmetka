import { Metadata } from "next";
import LoanClientPage from "@/app/components/LoanClientPage";
import { catalogService } from "@/app/services/catalogService";
import { LoanStructuredData } from "@/app/structured-data/LoanStructuredData";
import authorsService from "@/app/services/authorsService";
import { FaqsService } from "@/app/services/FaqService";
import settingsService from "@/app/services/settingsService";
import { getHomeData, LangType } from "@/app/services/HomeService";
import { getPageDates } from "@/app/services/PageDatesService";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const res = await catalogService.getAll({
		lang: lang === "ua" ? "uk" : "ru",
		type: "loan",
	});

	return {
		title: res.data[0].meta_title,
		description: res.data[0].meta_description,
		keywords: [
			lang === "uk" ? "позики онлайн" : "займы онлайн",
			"микрозайм",
			"МФО Украина",
			lang === "uk" ? "взяти позику" : "взять займ",
			"быстрые займы",
		],
		openGraph: {
			title: res.data[0].meta_title,
			description: res.data[0].meta_description,
			url: "https://mfoxa.com.ua/loans",
			siteName: "Займи.ру",
			type: "website",
		},
	};
}

type LoanPageProps = {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ count?: string }>;
};

export default async function LoanPageWrapper({
	params,
	searchParams,
}: LoanPageProps) {
	const { lang } = await params;
	const { count } = await searchParams;
	const visibleCount = count ? parseInt(count, 10) : 6;

	const data = await catalogService.getAll({
		lang: lang === "ua" ? "uk" : "ru",
		type: "loan",
	});

	const dataBySlug = await catalogService.getBySlug({
		slug: "loan",
		lang: lang === "ua" ? "uk" : "ru",
		isLoan: false,
	});

	const randomAuthor = await authorsService.getRandomAuthor(
		lang === "ua" ? "uk" : "ru"
	);

	const faqs = await FaqsService.getFaqs({ page_name: "loan" });
	const dates = await getPageDates({ type: "loans" });

	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"loan_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}
	const homeData = await getHomeData(lang as LangType);

	return (
		<>
			<LoanStructuredData
				lang={lang as "ru" | "ua"}
				dates={dates}
				getAllSettings={getAllSettings}
			/>
			<LoanClientPage
				homeData={homeData}
				faqs={faqs}
				getAllSettings={getAllSettings}
				data={data}
				dataBySlug={dataBySlug}
				randomAuthor={randomAuthor}
				visibleCount={visibleCount}
				locale={lang}
			/>
		</>
	);
}
