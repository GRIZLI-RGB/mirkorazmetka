// app/structured-data/BezotkazaStructuredData.tsx
import Script from "next/script";
import { MfoDetails } from "@/app/services/getMfoDetailsService";
import { CatalogPageFull } from "@/app/services/catalogService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { AuthorRandomResponse } from "@/app/services/authorsService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type BezotkazaStructuredDataProps = {
	lang: "ru" | "ua";
	data: MfoDetails[];
	page: CatalogPageFull;
	dates: PageDatesResponse;
	randomAuthor: AuthorRandomResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const BezotkazaStructuredData = ({
	lang,
	data,
	page,
	dates,
	randomAuthor,
}: BezotkazaStructuredDataProps) => {
	// Wilson confidence interval calculation for rating
	const calculateWilsonRating = (rating: number, count: number) => {
		if (count === 0) return rating;

		const z = 1.96; // 95% confidence level
		const p = rating / 5;
		const n = count;

		const numerator =
			p +
			(z * z) / (2 * n) -
			z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
		const denominator = 1 + (z * z) / n;

		return Math.max(0, Math.min(5, (numerator / denominator) * 5));
	};

	// Sort MFOs by Wilson rating
	const sortedMFOs = [...data].sort((a, b) => {
		const aWilson = calculateWilsonRating(a.rating_average, a.rating_count);
		const bWilson = calculateWilsonRating(b.rating_average, b.rating_count);
		return bWilson - aWilson;
	});

	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: page.meta_title || "Безотказные займы",
		description:
			page.meta_description ||
			"Лучшие МФО с высоким процентом одобрения займов",
		url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/${page.slug}`,
		datePublished: dates.date_published,
		dateModified: dates.date_modified,
		author: {
			"@type": "Person",
			name: randomAuthor?.data?.name || "Эксперт MFoxa",
		},
		publisher: {
			"@type": "Organization",
			name: "MFoxa",
			url: "https://mfoxa.com.ua",
		},
	};

	// BreadcrumbList schema
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Главная",
				item: "https://mfoxa.com.ua",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: page.h1_title || "Безотказные займы",
				item: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/${
					page.slug
				}`,
			},
		],
	};

	// ItemList schema for MFO ranking
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: page.h1_title || "Рейтинг МФО с высоким процентом одобрения",
		description:
			page.description_under_title ||
			"Лучшие микрофинансовые организации по проценту одобрения займов",
		itemListElement: sortedMFOs.map((mfo, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/mfo/${
				mfo.slug
			}`,
			name: mfo.name || "Page",
			item: {
				"@type": "Organization",
				name: mfo.name || "Page",
				url: mfo.redirect_url || mfo.official_website,
				logo: mfo.logo_url,
				description: `Микрофинансовая организация ${mfo.name} с высоким процентом одобрения займов`,
				address: {
					"@type": "PostalAddress",
					addressLocality: mfo.legal_address,
				},
				contactPoint: {
					"@type": "ContactPoint",
					telephone: mfo.phone,
					email: mfo.email,
				},
			},
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: mfo.rating_average.toString(),
				bestRating: "5",
				worstRating: "1",
				ratingCount: mfo.rating_count.toString(),
			},
		})),
	};

	// FAQPage schema if FAQs exist
	const faqSchema =
		page.faqs && page.faqs.length > 0
			? {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: page.faqs.map((faq) => ({
						"@type": "Question",
						name: faq.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: faq.answer,
						},
					})),
			  }
			: null;

	// Review schema for page rating
	const reviewSchema = {
		"@context": "https://schema.org",
		"@type": "Review",
		author: {
			"@type": "Person",
			name: randomAuthor?.data?.name || "Эксперт MFoxa",
		},
		reviewRating: {
			"@type": "Rating",
			ratingValue: "5",
			bestRating: "5",
			worstRating: "1",
		},
		itemReviewed: {
			"@type": "WebPage",
			name: page.h1_title || "Безотказные займы",
		},
	};

	// Combine all schemas
	const allSchemas: object[] = [
		webPageSchema,
		breadcrumbSchema,
		itemListSchema,
		reviewSchema,
	];

	// Add FAQ schema if available
	if (faqSchema) {
		allSchemas.push(faqSchema);
	}

	return (
		<>
			{allSchemas.map((schema, index) => (
				<Script
					key={index}
					id={`bezotkaza-schema-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema, null, 2),
					}}
				/>
			))}
		</>
	);
};
