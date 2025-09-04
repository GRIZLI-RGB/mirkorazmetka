import { MfoDetails } from "@/app/services/getMfoDetailsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { LangType } from "../services/HomeService";
import { emptyAddress, getDefaultWebPageSchema } from "./defaults";

type MicrodataCompanyProps = {
	company: string;
	data: MfoDetails;
	dates?: PageDatesResponse | null;
	lang: LangType;
};

export const MicrodataCompany = ({
	company,
	data,
	dates,
	lang,
}: MicrodataCompanyProps) => {
	const webPageSchema = getDefaultWebPageSchema({
		lang,
		dates: {
			date_modified: dates?.date_modified || new Date().toISOString(),
			date_published: dates?.date_published || new Date().toISOString(),
		},
		title: data.name || "Информация о МФО",
		description: `Условия займов и отзывы о ${data.name}`,
		path: `/mfo/${company}`,
	});

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
		address: emptyAddress,
		priceRange: "$$",
		telephone: "-",
		image: `https://mfoxa.com.ua/logo.png`,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: Number(data?.rating_average) || 5,
			bestRating: 5,
			worstRating: 1,
			ratingCount: Number(data?.rating_count) || 1,
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

	const loanSchema = {
		"@context": "https://schema.org",
		"@type": "LoanOrCredit",
		name: `Займ в ${data.name}`,
		description: `Условия получения займа в микрофинансовой организации ${data.name}`,
		provider: {
			"@type": "FinancialService",
			name: data.name,
			address: emptyAddress,
			priceRange: "$$",
			telephone: "-",
			image: `https://mfoxa.com.ua/logo.png`,
		},
		loanTerm: {
			"@type": "QuantitativeValue",
			minValue: data.tariffs?.[0]?.min_term || 1,
			maxValue: data.tariffs?.[0]?.max_term || 30,
			unitText: "DAY",
		},
		amount: {
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
