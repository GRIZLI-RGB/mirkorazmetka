import { Metadata } from "next";

import LoanClientPage from "@/app/components/LoanClientPage";
import authorsService from "@/app/services/authorsService";
import { catalogService } from "@/app/services/catalogService";
import { getPageDates } from "@/app/services/PageDatesService";
import settingsService from "@/app/services/settingsService";
import { getHomeData, LangType } from "@/app/services/HomeService";
// import { LoanSlugStructuredData } from "@/app/structured-data/LoanSlugStructuredData";

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
	} catch {
		console.error("❌ Ошибка получения по slug:", slug);
		throw new Error(`Ошибка при запросе catalogService.getBySlug`);
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
			{/* <LoanSlugStructuredData
				pageTitle={res.page.meta_title}
				pageUrl={`https://mfoxa.com.ua${
					lang === "ru" ? "/ru" : ""
				}/loan/${slug}`}
				loans={data.data.map((item) => ({
					name: item.button_name,
					url: `https://mfoxa.com.ua${
						lang === "ru" ? "/ru" : ""
					}/loan/${item.slug}`,
					legal_name: item.meta_title,
					license: undefined,
					apr_min: 0,
					apr_max: 1,
					rating_value: 5,
					review_count: 0,
					offers: [
						{
							name: "Первый кредит",
							url: `https://mfoxa.com.ua/apply?type=first&loan=${item.slug}`,
							amount_min: 0,
							amount_max: 5000,
							term_min: 1,
							term_max: 30,
							interestRate: 0,
						},
						{
							name: "Повторный кредит",
							url: `https://mfoxa.com.ua/apply?type=repeat&loan=${item.slug}`,
							amount_min: 0,
							amount_max: 30000,
							term_min: 1,
							term_max: 30,
							interestRate: 0.01,
						},
					],
				}))}
			/> */}
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
