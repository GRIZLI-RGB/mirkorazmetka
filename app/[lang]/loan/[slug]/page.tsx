/* eslint-disable @typescript-eslint/no-explicit-any */
import LoanClientPage from "@/app/components/LoanClientPage";
import authorsService from "@/app/services/authorsService";
import { catalogService } from "@/app/services/catalogService";
import { getPageDates } from "@/app/services/PageDatesService";
import settingsService from "@/app/services/settingsService";
import { getHomeData, LangType } from "@/app/services/HomeService";
import { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
	const { lang, slug } = await params;
	const res = await catalogService.getBySlug({
		slug,
		lang: lang === "ua" ? "uk" : "ru",
	});

	return {
		title: res.page.meta_title,
		description: res.page.meta_description,
		keywords: [
			lang === "uk" ? "позики онлайн" : "займы онлайн",
			"микрозайм",
			"МФО Украина",
			lang === "uk" ? "взяти позику" : "взять займ",
			"быстрые займы",
		],
		openGraph: {
			title: res.page.meta_title,
			description: res.page.meta_description,
			url: "https://mfoxa.com.ua/loans",
			siteName: "Займи.ру",
			type: "website",
		},
	};
}
type LoanDescriptionProps = {
	params: Promise<{ lang: string; slug: string }>;
	searchParams: Promise<{ count?: string }>;
};
export default async function LoanDescription({
	params,
	searchParams,
}: LoanDescriptionProps) {
	const { lang, slug } = await params;
	const { count } = await searchParams;
	const visibleCount = count ? parseInt(count, 10) : 6;

	const data = await catalogService.getAll({
		lang: lang === "ua" ? "uk" : "ru",
		type: "loan",
	});

	const dataBySlug = await catalogService.getBySlug({
		slug: `loan/${slug}`,
		lang: lang === "ua" ? "uk" : "ru",
		isLoan: false,
	});

	let res;

	try {
		res = await catalogService.getBySlug({
			slug,
			lang: lang === "ua" ? "uk" : "ru",
		});
	} catch (error: any) {
		console.error("❌ Ошибка получения по slug:", slug);
		console.error("Axios message:", error);
		console.error("Axios response:", error?.response?.data || "Нет ответа");

		throw new Error(
			`Ошибка при запросе catalogService.getBySlug: ${error.message}`
		);
	}
	const dates = await getPageDates({ type: "loans" });
	const randomAuthor = await authorsService.getRandomAuthor(
		lang === "ua" ? "uk" : "ru"
	);
	const homeData = await getHomeData(lang as LangType);

	if (!res) {
		throw new Error(`Не удалось получить страницу по slug: ${slug}`);
	}
	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"loan_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}

	return (
		<>
			<LoanClientPage
				page={res.page}
				getAllSettings={getAllSettings}
				randomAuthor={randomAuthor}
				faqs={res.page.faqs}
				dates={dates}
				data={data}
				dataBySlug={dataBySlug}
				slug={slug}
				visibleCount={visibleCount}
				locale={lang}
				homeData={homeData}
			/>
		</>
	);
}
