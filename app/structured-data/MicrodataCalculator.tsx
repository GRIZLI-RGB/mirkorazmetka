// app/structured-data/MicrodataCalculator.tsx
import Script from "next/script";
import { useTranslations } from "next-intl";

type MicrodataCalculatorProps = {
	companyName: string;
	locale: "ru" | "ua";
};

export const MicrodataCalculator = ({
	companyName,
	locale,
}: MicrodataCalculatorProps) => {
	const t = useTranslations("Catalog");

	const calculatorSchema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: t("calculatorCompany", { company: companyName }),
		applicationCategory: "FinancialApplication",
		operatingSystem: "Web",
		url: `https://mfoxa.com.ua/${locale}/mfo/${companyName
			.toLowerCase()
			.replace(/\s/g, "-")}`,
	};

	return (
		<Script id="calculator-schema" type="application/ld+json">
			{JSON.stringify(calculatorSchema, null, 2)}
		</Script>
	);
};
