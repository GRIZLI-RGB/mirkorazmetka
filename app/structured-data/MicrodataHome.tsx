import Script from "next/script";
import { getHomeData } from "@/app/services/HomeService";

type MicrodataHomeProps = {
	locale: "ru" | "ua";
	homeData: Awaited<ReturnType<typeof getHomeData>>;
};

const getRatingValueOrCount = (
	ratingAverage: string | number,
	isCount = false
): string => {
	const num = +ratingAverage;

	return num ? String(ratingAverage) : isCount ? "100" : "4.5";
};

export const MicrodataHome = async ({
	locale,
	homeData,
}: MicrodataHomeProps) => {
	const webSiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "MFoxa",
		url: "https://mfoxa.com.ua",
		// logo: "https://mfoxa.com.ua/logo.png",
	};

	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "MFoxa - Финансовый маркетплейс",
		url: `https://mfoxa.com.ua/${locale}`,
		description: "Подберите и оформите лучшие займы онлайн в Украине.",
		datePublished: "2023-01-01",
		dateModified: homeData.top_mfos[0]?.updated_at || "2025-07-12",
		// aggregateRating: {
		// 	"@type": "AggregateRating",
		// 	ratingValue: "4.8",
		// 	bestRating: "5",
		// 	ratingCount: "500",
		// },
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Главная",
				item: "https://mfoxa.com.ua/",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Рейтинг МФО",
				item: `https://mfoxa.com.ua/${locale}/mfo`,
			},
		],
	};

	const bestLoansSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Лучшие кредиты",
		itemListElement: homeData.best_credits.map((credit, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Organization",
				name: credit.name,
				url: `https://mfoxa.com.ua/${locale}/mfo/${credit.slug}`,
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: getRatingValueOrCount(credit.rating_average),
					bestRating: "5",
					ratingCount: getRatingValueOrCount(
						credit.rating_count,
						true
					),
				},
			},
		})),
	};

	const topMfoSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Топ МФО Украины",
		itemListElement: homeData.top_mfos.map((mfo, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Organization",
				name: mfo.name || "Page",
				url: `https://mfoxa.com.ua/${locale}/mfo/${mfo.slug}`,
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: getRatingValueOrCount(mfo.rating_average),
					bestRating: "5",
					ratingCount: getRatingValueOrCount(mfo.rating_count, true),
				},
			},
		})),
	};

	const reviewsSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Последние отзывы",
		itemListElement: homeData.recent_reviews.map((review, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Review",
				author: {
					"@type": "Person",
					name: review.author_name || "Аноним",
				},
				datePublished: review.created_at,
				reviewBody: review.review_text,
				reviewRating: {
					"@type": "Rating",
					ratingValue: +review.rating || 0,
					bestRating: 5,
					worstRating: 1,
				},
				itemReviewed: {
					"@type": "Organization",
					name: review.mfo.name,
					url: `https://mfoxa.com.ua/${locale}/mfo/${review.mfo.slug}`,
					aggregateRating: {
						"@type": "AggregateRating",
						ratingValue: +review.rating || 0,
						bestRating: 5,
						ratingCount: 1,
					},
				},
			},
		})),
	};

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "Как выбрать надежную МФО?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Выбирайте МФО с высоким рейтингом, положительными отзывами и прозрачными условиями. Обратите внимание на лицензию НБУ и условия кредитования.",
				},
			},
			{
				"@type": "Question",
				name: "Какие документы нужны для оформления займа?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Обычно требуется паспорт, ИНН и банковская карта. Некоторые МФО могут запрашивать дополнительные данные.",
				},
			},
			{
				"@type": "Question",
				name: "Как быстро можно получить деньги?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Большинство МФО переводят деньги на карту в течение 5-30 минут после одобрения заявки.",
				},
			},
			{
				"@type": "Question",
				name: "Можно ли взять займ с плохой кредитной историей?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Да, многие МФО предлагают займы клиентам с плохой кредитной историей, но условия могут быть менее выгодными.",
				},
			},
		],
	};

	return (
		<>
			<Script id="home-website-schema" type="application/ld+json">
				{JSON.stringify(webSiteSchema, null, 2)}
			</Script>
			<Script id="home-webpage-schema" type="application/ld+json">
				{JSON.stringify(webPageSchema, null, 2)}
			</Script>
			<Script id="breadcrumb-schema" type="application/ld+json">
				{JSON.stringify(breadcrumbSchema, null, 2)}
			</Script>
			<Script id="best-loans-schema" type="application/ld+json">
				{JSON.stringify(bestLoansSchema, null, 2)}
			</Script>
			<Script id="top-mfo-schema" type="application/ld+json">
				{JSON.stringify(topMfoSchema, null, 2)}
			</Script>
			<Script id="recent-reviews-schema" type="application/ld+json">
				{JSON.stringify(reviewsSchema, null, 2)}
			</Script>
			<Script id="faq-schema" type="application/ld+json">
				{JSON.stringify(faqSchema, null, 2)}
			</Script>
		</>
	);
};
