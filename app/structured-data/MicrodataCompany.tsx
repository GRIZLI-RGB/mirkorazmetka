import { MfoDetails } from "@/app/services/getMfoDetailsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { getValidRatingOrCount } from "../lib/utils";

type MicrodataCompanyProps = {
	company: string;
	data: MfoDetails;
	dates?: PageDatesResponse | null;
};

export const MicrodataCompany = ({
	company,
	data,
	dates,
}: MicrodataCompanyProps) => {
	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: data.name || "Информация о МФО",
		description: `Условия займов и отзывы о ${data.name}`,
		url: `https://mfoxa.com.ua/mfo/${company}`,
		datePublished: dates?.date_published,
		dateModified: dates?.date_modified,
		publisher: {
			"@type": "Organization",
			name: "MFoxa",
			url: "https://mfoxa.com.ua",
		},
	};

	// Organization schema for the MFO company
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "FinancialService",
		name: data.name || "Название компании",
		alternateName: data.legal_entity,
		url: data.redirect_url || data.official_website,
		logo: data.logo_url,
		description: `Микрофинансовая организация ${data.name} - условия займов, отзывы клиентов`,
		identifier: data.nbu_license,
		contactPoint: {
			"@type": "ContactPoint",
			telephone: data.phone,
			email: data.email,
			contactType: "customer service",
			areaServed: "UA",
			availableLanguage: ["Ukrainian", "Russian"],
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: data.legal_address,
			addressCountry: "UA",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: getValidRatingOrCount(data.rating_average),
			bestRating: "5",
			worstRating: "1",
			ratingCount: getValidRatingOrCount(data.rating_count, true),
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: `Тарифы ${data.name}`,
			itemListElement:
				// eslint-disable-next-line
				data.tariffs?.map((tariff: any, index: number) => ({
					"@type": "Offer",
					name: tariff.name || `Тариф ${index + 1}`,
					description: tariff.description,
					price: tariff.max_amount,
					priceCurrency: "UAH",
					availability: "https://schema.org/InStock",
				})) || [],
		},
	};

	// LoanOrCredit schema for loan products
	const loanSchema = {
		"@context": "https://schema.org",
		"@type": "LoanOrCredit",
		name: `Займ в ${data.name}`,
		description: `Условия получения займа в микрофинансовой организации ${data.name}`,
		provider: {
			"@type": "FinancialService",
			name: data.name,
		},
		loanTerm: {
			"@type": "QuantitativeValue",
			minValue: data.tariffs?.[0]?.min_term || 1,
			maxValue: data.tariffs?.[0]?.max_term || 30,
			unitText: "DAY",
		},
		loanAmount: {
			"@type": "MonetaryAmount",
			minValue: data.tariffs?.[0]?.min_amount || 1000,
			maxValue: data.tariffs?.[0]?.max_amount || 30000,
			currency: "UAH",
		},
		interestRate: {
			"@type": "QuantitativeValue",
			value: data.tariffs?.[0]?.daily_rate || 1,
			unitText: "PERCENT",
		},
	};

	const allSchemas: object[] = [
		webPageSchema,
		organizationSchema,
		loanSchema,
	];

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
