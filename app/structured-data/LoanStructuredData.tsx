import { PageDatesResponse } from "@/app/services/PageDatesService";
import { SettingsGroupResponse } from "@/app/services/settingsService";
import { getDefaultWebPageSchema } from "./defaults";

type LoanStructuredDataProps = {
	lang: "ru" | "ua";
	dates: PageDatesResponse;
	getAllSettings: SettingsGroupResponse | undefined;
};

export const LoanStructuredData = ({
	lang,
	dates,
	getAllSettings,
}: LoanStructuredDataProps) => {
	const webPageSchema = getDefaultWebPageSchema({
		lang,
		title:
			getAllSettings?.settings.loan_page_title ||
			(lang === "ua"
				? "Позики онлайн - МФО України"
				: "Займы онлайн - МФО Украины"),
		description:
			getAllSettings?.settings.loan_page_description ||
			(lang === "ua"
				? "Отримайте позику онлайн від перевірених МФО України. Швидке схвалення, вигідні умови, мінімальні вимоги."
				: "Получите займ онлайн от проверенных МФО Украины. Быстрое одобрение, выгодные условия, минимальные требования."),
		path: "/loan",
		dates,
	});

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(webPageSchema),
			}}
		/>
	);
};
