import { getTranslations } from "next-intl/server";
import { MfoDetails } from "@/app/services/getMfoDetailsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { AuthorRandomResponse } from "@/app/services/authorsService";
import { SettingsGroupResponse } from "@/app/services/settingsService";
import { getValidRatingOrCount } from "../lib/utils";

type MfoPageStructuredDataProps = {
	lang: "ru" | "ua";
	data: MfoDetails[];
	dates: PageDatesResponse;
	randomAuthor: AuthorRandomResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const MfoPageStructuredData = async ({
	lang,
	data,
	dates,
	randomAuthor,
	getAllSettings,
}: MfoPageStructuredDataProps) => {
	const t = await getTranslations({ locale: lang, namespace: "Metadata" });

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

	const uniqueMFOs = Array.from(
		new Map(sortedMFOs.map((m) => [m.slug, m])).values()
	);

	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name:
			getAllSettings?.settings.mfo_page_meta_title ||
			t("mfo.title") ||
			"Рейтинг МФО",
		description:
			getAllSettings?.settings.mfo_page_meta_description ||
			t("mfo.description") ||
			"Рейтинг микрофинансовых организаций Украины",
		url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/mfo`,
		datePublished: dates.date_published,
		dateModified: dates.date_modified,
		publisher: {
			"@type": "Organization",
			name: "MFoxa",
			url: "https://mfoxa.com.ua",
		},
	};

	// ItemList schema for MFO ranking
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: getAllSettings?.settings.mfo_page_title || "Рейтинг МФО Украины",
		description:
			getAllSettings?.settings.mfo_page_description ||
			"Лучшие микрофинансовые организации по отзывам клиентов",
		itemListElement: uniqueMFOs.map((mfo, index) => ({
			"@type": "ListItem",
			position: index + 1,
			// url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/mfo/${
			// 	mfo.slug
			// }`,
			// name: `${mfo.name || "Page"} (${index + 1})`,
			item: {
				"@type": "Organization",
				// name: mfo.name || "Page",
				// url: mfo.redirect_url || mfo.official_website,
				name: `${mfo.name || "Page"} (${index + 1})`,
				url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/mfo/${
					mfo.slug
				}`,
				logo: mfo.logo_url,
				// address: {
				// 	"@type": "PostalAddress",
				// 	addressLocality: mfo.legal_address,
				// },
				// contactPoint: {
				// 	"@type": "ContactPoint",
				// 	telephone: mfo.phone,
				// 	email: mfo.email,
				// },
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: getValidRatingOrCount(mfo.rating_average),
					bestRating: "5",
					worstRating: "1",
					ratingCount: getValidRatingOrCount(mfo.rating_count, true),
				},
			},
		})),
	};

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
			"@type": "Organization",
			name: getAllSettings?.settings.mfo_page_title || "Рейтинг МФО",
			url: "https://mfoxa.com.ua",
		},
	};

	// Combine all schemas
	const allSchemas: object[] = [webPageSchema, itemListSchema, reviewSchema];

	return (
		<>
			{allSchemas.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema),
					}}
				/>
			))}
		</>
	);
};
