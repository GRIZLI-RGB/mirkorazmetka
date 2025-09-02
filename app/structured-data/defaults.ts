export const defaultOrganizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "MFoxa",
	url: "https://mfoxa.com.ua",
	logo: "https://mfoxa.com.ua/logo.png",
	image: "https://mfoxa.com.ua/logo.png",
	description:
		"Mfoxa — каталог и рейтинг МФО Украины. Сравнение условий, отзывы клиентов и лучшие предложения онлайн кредитов.",
	contactPoint: [
		{
			"@type": "ContactPoint",
			telephone: "+380XXXXXXXXX", // если есть номер
			contactType: "customer service",
			areaServed: "UA",
			availableLanguage: ["ru", "uk"],
		},
	],
	sameAs: [
		"https://www.facebook.com/...", // ссылки на соцсети, если есть
		"https://t.me/...",
		"https://www.youtube.com/...",
	],
};
