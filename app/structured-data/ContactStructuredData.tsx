// app/structured-data/ContactStructuredData.tsx
import Script from "next/script";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type ContactStructuredDataProps = {
	lang: "ru" | "ua";
	dates: PageDatesResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const ContactStructuredData = ({
	lang,
	dates,
	getAllSettings,
}: ContactStructuredDataProps) => {
	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: getAllSettings?.settings.contacts_page_title || "Контакты MFoxa",
		description:
			getAllSettings?.settings.contacts_page_description ||
			"Контактная информация финансового маркетплейса MFoxa",
		url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/contacts`,
		datePublished: dates.date_published,
		dateModified: dates.date_modified,
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
				name: lang === "ru" ? "Контакты" : "Контакти",
				item: `https://mfoxa.com.ua${
					lang === "ru" ? "/ru" : ""
				}/contacts`,
			},
		],
	};

	// Organization schema for MFoxa
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "MFoxa",
		url: "https://mfoxa.com.ua",
		description:
			"Финансовый маркетплейс микрофинансовых организаций Украины",
		logo: "https://mfoxa.com.ua/logo.png",
		contactPoint: [
			{
				"@type": "ContactPoint",
				telephone: "+38 (093) 000-00-00",
				contactType: "customer service",
				email: "admin@mfoxa.com.ua",
				areaServed: "UA",
				availableLanguage: ["Russian", "Ukrainian"],
				hoursAvailable: {
					"@type": "OpeningHoursSpecification",
					dayOfWeek: [
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
					],
					opens: "09:00",
					closes: "18:00",
				},
			},
			{
				"@type": "ContactPoint",
				telephone: "+38 (063) 000-00-00",
				contactType: "technical support",
				email: "support@mfoxa.com.ua",
				areaServed: "UA",
			},
		],
		address: {
			"@type": "PostalAddress",
			streetAddress: "Архитекторів 32",
			addressLocality: "Харьков",
			postalCode: "61174",
			addressRegion: "Харківська обл.",
			addressCountry: "UA",
		},
		sameAs: ["https://t.me/mfoxa", "https://facebook.com/mfoxa"],
		foundingDate: "2020",
		hasCredential: "Лицензия НБУ",
	};

	// LocalBusiness schema for physical location
	const localBusinessSchema = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: "MFoxa - Финансовый маркетплейс",
		description: "Офис финансового маркетплейса MFoxa в Харькове",
		url: "https://mfoxa.com.ua",
		telephone: "+38 (093) 000-00-00",
		email: "admin@mfoxa.com.ua",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Архитекторів 32",
			addressLocality: "Харьков",
			postalCode: "61174",
			addressRegion: "Харківська обл.",
			addressCountry: "UA",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: "49.9935",
			longitude: "36.2304",
		},
		openingHours: ["Mo-Fr 09:00-18:00"],
		priceRange: "$$",
	};

	// Combine all schemas
	const allSchemas = [
		webPageSchema,
		breadcrumbSchema,
		organizationSchema,
		localBusinessSchema,
	];

	return (
		<>
			{allSchemas.map((schema, index) => (
				<Script
					key={index}
					id={`contact-schema-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema, null, 2),
					}}
				/>
			))}
		</>
	);
};
