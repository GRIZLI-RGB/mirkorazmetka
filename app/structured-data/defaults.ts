import { LangType } from "../services/HomeService";

export const knowsAboutByLang = {
	ru: ["Микрофинансирование", "Финансовые услуги", "Кредитование"],
	ua: ["Мікрофінансування", "Фінансові послуги", "Кредитування"],
};

export const addressByLang = {
	ru: {
		addressRegion: "Харьковская обл.",
		streetAddress: "Архитекторов 32",
		addressLocality: "Харьков",
	},
	ua: {
		addressRegion: "Харківська обл.",
		streetAddress: "Архітекторів 32",
		addressLocality: "Харків",
	},
};

export const getDefaultWebPageSchema = ({
	lang,
	title,
	description,
	path,
	dates,
}: {
	lang: LangType;
	title: string;
	description: string;
	path: string;
	dates: { date_published: string; date_modified: string };
}) => ({
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: title,
	description,
	url: `https://mfoxa.com.ua${lang === "ru" ? "/ru" : ""}${path}`,
	datePublished: dates.date_published,
	dateModified: dates.date_modified,
	inLanguage: lang === "ua" ? "uk-UA" : "ru-UA",
	isPartOf: {
		"@type": "WebSite",
		url: "https://mfoxa.com.ua",
	},
	publisher: {
		"@type": "Organization",
		name: "MFoxa",
		url: "https://mfoxa.com.ua",
		logo: {
			"@type": "ImageObject",
			url: "https://mfoxa.com.ua/logo.png",
		},
	},
});
