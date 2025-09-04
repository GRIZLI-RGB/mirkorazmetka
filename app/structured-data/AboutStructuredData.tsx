import { Author } from "@/app/services/authorsService";
import { PageDatesResponse } from "@/app/services/PageDatesService";
import { SettingsGroupResponse } from "@/app/services/settingsService";
import { getDefaultWebPageSchema } from "./defaults";

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
	const webPageSchema = getDefaultWebPageSchema({
		lang,
		title:
			getAllSettings?.settings.about_page_title ||
			"Наша команда экспертов",
		description:
			getAllSettings?.settings.about_page_description ||
			"Команда профессионалов финансовой сферы",
		path: "/about",
		dates,
	});

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

	const allSchemas = [webPageSchema, ...personSchemas];

	return (
		<>
			{allSchemas.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema, null, 2),
					}}
				/>
			))}
		</>
	);
};
