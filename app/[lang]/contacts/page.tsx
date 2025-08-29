import React from "react";
import { Metadata } from "next";
import Bread from "../../components/Bread";
import { ContactStructuredData } from "../../structured-data/ContactStructuredData";
import { getTranslations } from "next-intl/server";
import ContactContent from "@/app/components/ContactContent";
import { getPageDates } from "@/app/services/PageDatesService";
import settingsService from "@/app/services/settingsService";

export async function generateMetadata({
	params,
}: ContactPageProps): Promise<Metadata> {
	const { lang } = await params;

	let metaSettings;
	try {
		const res = await settingsService.getSettingsByGroup(
			"contacts_page",
			lang === "ua" ? "uk" : "ru"
		);
		metaSettings = res.settings;
	} catch (e) {
		console.error("Ошибка загрузки мета-настроек contacts_page:", e);
	}

	return {
		title:
			metaSettings?.contacts_page_meta_title ||
			"Контакты MFoxa | Свяжитесь с нами",
		description:
			metaSettings?.contacts_page_meta_description ||
			"Контактная информация финансового маркетплейса MFoxa. Адрес, телефон, email для связи с поддержкой.",
		openGraph: {
			title: metaSettings?.contacts_page_meta_title || "Контакты MFoxa",
			description:
				metaSettings?.contacts_page_meta_description ||
				"Как связаться с финансовым маркетплейсом MFoxa",
			url: "https://mfoxa.com.ua/contacts",
		},

		keywords: [
			"контакты MFoxa",
			"поддержка МФО",
			"связаться с финансовым маркетплейсом",
		],
	};
}

type ContactPageProps = {
	params: Promise<{ lang: string }>;
};

const ContactPage = async ({ params }: ContactPageProps) => {
	const { lang } = await params;
	const t = await getTranslations({ locale: lang, namespace: "Contacts" });
	const dates = await getPageDates({ type: "contacts" });

	let getAllSettings;

	try {
		getAllSettings = await settingsService.getSettingsByGroup(
			"contacts",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}
	let getAllSettingsContacts_page;

	try {
		getAllSettingsContacts_page = await settingsService.getSettingsByGroup(
			"contacts_page",
			lang === "ua" ? "uk" : "ru"
		);
	} catch (error) {
		console.error("Ошибка при получении настроек:", error);
	}

	return (
		<>
			<ContactStructuredData
				lang={lang as "ru" | "ua"}
				dates={dates}
				getAllSettings={getAllSettingsContacts_page}
			/>
			<Bread lang={lang as "ua" | "ru"} />
			<div className="px-0 md:px-[20px]">
				<div className="p-[10px] sm:p-[20px] md:p-[30px] mb-[20px] sm:mb-[30px] md:mb-[50px] bg-white rounded-lg mt-[10px] md:mt-[30px]">
					<h1
						className="text-[20px] sm:text-[28px] md:text-[36px] font-[700] leading-[100%] text-[#222] mb-[14px] sm:mb-[25px] md:mb-[30px]"
						style={{ fontFamily: "var(--Jakarta)" }}
					>
						{getAllSettingsContacts_page?.settings
							.contacts_page_title ||
							t("title") ||
							"Контакты"}
					</h1>
					<p
						className="text-[11px] sm:text-[12px] md:text-[13px] font-[500] leading-[138%] text-[#222]"
						style={{ fontFamily: "var(--Montserrat)" }}
					>
						{getAllSettingsContacts_page?.settings
							.contacts_page_description ||
							t("description") ||
							"Сервис предоставляет актуальную информацию о кредитных продуктах различных банков и микрофинансовых организаций Украины..."}
					</p>
				</div>
			</div>

			{/* Клиентский компонент с состоянием */}
			<ContactContent settings={getAllSettings?.settings} />

			<div className="px-0 md:px-[20px]">
				<p className="font-medium text-[13px] leading-[138%] text-[#67677a]">
					{t("metadata.addedDate") +
						": " +
						new Date(dates.date_published).toLocaleDateString(
							"ru-RU"
						) || "Дата добавления страницы 12.10.2025"}
				</p>
				<p className="font-medium text-[13px] leading-[138%] text-[#67677a]">
					{t("metadata.updatedDate") +
						": " +
						new Date(dates.date_modified).toLocaleDateString(
							"ru-RU"
						) || "Дата изменения страницы 12.10.2025"}
				</p>
			</div>
		</>
	);
};

export default ContactPage;
