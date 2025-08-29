import Script from "next/script";
import { FaqItem } from "@/app/services/catalogService";

type FAQPageProps = {
	faqs: FaqItem[];
};

export const FAQPage = ({ faqs }: FAQPageProps) => {
	const faqData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};

	return (
		<Script id="faq-schema" type="application/ld+json">
			{JSON.stringify(faqData, null, 2)}
		</Script>
	);
};
