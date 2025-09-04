import CompanyRewiwsClient from "@/app/components/CompanyRewiwsClient";
import { getMfoDetails } from "@/app/services/getMfoDetailsService";
import { getPageDates } from "@/app/services/PageDatesService";
import { Metadata } from "next";

interface Props {
	params: Promise<{ company: string; lang: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { company, lang } = await params;
	const slug = decodeURIComponent(company || "sgroshi");

  const companyName = slug
		.replace(/-/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());

	let messages;
	try {
		messages = (await import(`@/app/messages/${lang}.json`)).default;
	} catch {
		messages = (await import(`@/app/messages/ru.json`)).default;
	}

	const template = messages?.Metadata?.reviews || {
		title: "Отзывы {company}",
		description: "Отзывы о {company}",
	};

	const title = template.title.replace("{company}", companyName);
	const description = template.description.replace("{company}", companyName);

	return {
		title,
		description,
		keywords: [
			lang === "ua" ? "відгуки" : "отзывы",
			"МФО",
			companyName,
			lang === "ua" ? "рейтинг" : "рейтинг",
			lang === "ua" ? "позики" : "займы",
		],
		openGraph: {
			title,
			description,
			url: `https://mfoxa.com.ua${
				lang === "ru" ? "/ru" : ""
			}/mfo/${slug}/reviews`,
			siteName: "MFoxa",
			type: "website",
			images: [`https://mfoxa.com.ua/og-${slug}-reviews.jpg`],
		},
		alternates: {
			canonical: `https://mfoxa.com.ua${
				lang === "ru" ? "/ru" : ""
			}/mfo/${slug}/reviews`,
		},
	};
}

export default async function CompanyReviewsPage({ params }: Props) {
	const { company, lang } = await params;
	const companySlug = decodeURIComponent(company || "sgroshi");
	const { data } = await getMfoDetails(
		companySlug,
		lang === "ua" ? "uk" : "ru"
	);
	const dates = companySlug
		? await getPageDates({ type: "reviews", mfo_slug: companySlug })
		: null;
	return (
		<CompanyRewiwsClient
			lang={lang}
			mfoData={data}
			slug={companySlug}
			dates={dates}
		/>
	);
}
