import { GetCatalogListResponse } from "@/app/services/catalogService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { AuthorRandomResponse } from "@/app/services/authorsService";
import { SettingsGroupResponse } from "@/app/services/settingsService";

type LoanStructuredDataProps = {
	lang: "ru" | "ua";
	data: GetCatalogListResponse;
	dates: PageDatesResponse;
	randomAuthor: AuthorRandomResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const LoanStructuredData = ({
	lang,
	data,
	dates,
	randomAuthor,
	getAllSettings,
}: LoanStructuredDataProps) => {
	// WebPage schema
	const webPageSchema = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name:
			getAllSettings?.settings.loan_page_title ||
			"Займы онлайн - МФО Украины",
		description:
			getAllSettings?.settings.loan_page_description ||
			"Получите займ онлайн от проверенных МФО Украины. Быстрое одобрение, выгодные условия, минимальные требования.",
		url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}/loan`,
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

	// ItemList schema for loan catalog
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Каталог займов МФО Украины",
		description: `Доступные займы от ${data.data.length} микрофинансовых организаций`,
		itemListElement: data.data.map((loan, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: loan.meta_title || loan.h1_title || `Займ ${index + 1}`,
			item: {
				"@type": "LoanOrCredit",
				name: loan.meta_title || loan.h1_title || `Займ ${index + 1}`,
				description:
					loan.meta_description ||
					loan.description_under_title ||
					"Быстрый займ онлайн",
				provider: {
					"@type": "FinancialService",
					name: loan.meta_title || loan.h1_title || "МФО",
					url: `https://mfoxa.com.ua${
						lang === "ru" ? "/ru" : ""
					}/loan/${loan.slug}`,
					address: {
						"@type": "PostalAddress",
						addressLocality: "Украина",
					},
				},
				loanType: "Микрозайм",
				loanTerm: {
					"@type": "QuantitativeValue",
					unitText: "дней",
				},
				interestRate: {
					"@type": "QuantitativeValue",
					unitText: "% годовых",
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
			url: "https://mfoxa.com.ua",
			name:
				getAllSettings?.settings.loan_page_title ||
				"Займы онлайн - МФО Украины",
		},
	};

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
