// app/structured-data/AboutStructuredData.tsx
import Script from "next/script";
import { Author } from "@/app/services/authorsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type AboutStructuredDataProps = {
	lang: "ru" | "ua";
	authors: Author[];
	dates: PageDatesResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const AboutStructuredData = ({
	lang,
	authors,
	dates,
	getAllSettings,
}: AboutStructuredDataProps) => {
	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name:
			getAllSettings?.settings.about_page_title ||
			"Наша команда экспертов",
		description:
			getAllSettings?.settings.about_page_description ||
			"Команда профессионалов финансовой сферы",
		url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/about`,
		datePublished: dates.date_published,
		dateModified: dates.date_modified,
		publisher: {
			"@type": "Organization",
			name: "MFoxa",
			url: "https://mfoxa.com.ua",
			description: "Маркетплейс микрофинансовых организаций Украины",
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
				name: lang === "ru" ? "О нас" : "Про нас",
				item: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/about`,
			},
		],
	};

	// Organization schema for MFoxa
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "MFoxa",
		url: "https://mfoxa.com.ua",
		description: "Маркетплейс микрофинансовых организаций Украины",
		logo: "https://mfoxa.com.ua/logo.png",
		address: {
			"@type": "PostalAddress",
			addressCountry: "UA",
			streetAddress: "Архитекторів 32",
			addressLocality: "Харьков",
			postalCode: "61174",
		},
		hasCredential: {
			"@type": "EducationalOccupationalCredential",
			credentialCategory: "License",
			name: "Лицензия НБУ",
		},
		foundingDate: "2020",
		employee: authors.map((author) => ({
			"@type": "Person",
			name: author.name,
			jobTitle: author.role || "Эксперт",
			description: author.education,
			knowsAbout: [
				"Микрофинансирование",
				"Финансовые услуги",
				"Кредитование",
			],
		})),
	};

	// Person schemas for each team member
	const personSchemas = authors.map((author) => ({
		"@context": "https://schema.org",
		"@type": "Person",
		name: author.name,
		jobTitle: author.role || "Эксперт",
		description: `${author.education} | ${author.work_experience}`,
		knowsAbout: [
			"Микрофинансирование",
			"Финансовые услуги",
			"Кредитование",
		],
    hasCredential: {
			"@type": "EducationalOccupationalCredential",
			credentialCategory: "License",
			name: author.additional_qualification || "Лицензия НБУ",
		},
		image: author.avatar,
		worksFor: {
			"@type": "Organization",
			name: "MFoxa",
			url: "https://mfoxa.com.ua",
		},
	}));

	// Combine all schemas
	const allSchemas = [
		webPageSchema,
		breadcrumbSchema,
		organizationSchema,
		...personSchemas,
	];

	return (
		<>
			{allSchemas.map((schema, index) => (
				<Script
					key={index}
					id={`about-schema-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema, null, 2),
					}}
				/>
			))}
		</>
	);
};
