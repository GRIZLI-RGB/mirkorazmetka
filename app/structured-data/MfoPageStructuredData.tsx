import { MfoDetails } from "@/app/services/getMfoDetailsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { SettingsGroupResponse } from "@/app/services/settingsService";
import { calculateWilsonRating, getDefaultWebPageSchema } from "./defaults";

type MfoPageStructuredDataProps = {
	lang: "ru" | "ua";
	data: MfoDetails[];
	dates: PageDatesResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const MfoPageStructuredData = async ({
	lang,
	data,
	dates,
	getAllSettings,
}: MfoPageStructuredDataProps) => {
	const sortedMFOs = [...data].sort((a, b) => {
		const aWilson = calculateWilsonRating(a.rating_average, a.rating_count);
		const bWilson = calculateWilsonRating(b.rating_average, b.rating_count);
		return bWilson - aWilson;
	});

	const uniqueMFOs = Array.from(
		new Map(sortedMFOs.map((m) => [m.slug, m])).values()
	);

	const webPageSchema = getDefaultWebPageSchema({
		lang,
		title: getAllSettings?.settings.mfo_page_meta_title || "Рейтинг МФО",
		description:
			getAllSettings?.settings.mfo_page_meta_description ||
			"Рейтинг микрофинансовых организаций Украины",
		path: "/mfo",
		dates,
	});

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
			name: mfo?.name?.trim() || `MFO ${index + 1}`,
			url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/mfo/${
				mfo.slug
			}`,
			item: {
				"@type": "Organization",
				url:
					mfo.redirect_url ||
					mfo.official_website ||
					`https://mfoxa.com.ua/mfo/${mfo.slug}`,
				logo: mfo.logo_url,
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: Number(mfo?.rating_average) || 5,
					bestRating: 5,
					worstRating: 1,
					ratingCount: Number(mfo?.rating_count) || 1,
				},
			},
		})),
	};

	const allSchemas: object[] = [webPageSchema, itemListSchema];

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
