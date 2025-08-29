// app/structured-data/MicrodataAllReviews.tsx
import Script from "next/script";
import { useTranslations } from "next-intl";
import { getValidRatingOrCount } from "../lib/utils";

type Review = {
	id: number;
	mfo: { name: string; logo_url: string; slug: string };
	rating: number;
	author_name: string;
	review_text: string;
	created_at: string; // Добавлено для соответствия ТЗ
};

type MicrodataAllReviewsProps = {
	reviews: Review[];
	locale: "ru" | "ua";
};

export const MicrodataAllReviews = ({
	reviews,
	locale,
}: MicrodataAllReviewsProps) => {
	const t = useTranslations("ReviewsPage");

	const reviewsSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: t("title") || "Все отзывы об МФО Украины",
		itemListElement: reviews.map((review, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Review",
				author: {
					"@type": "Person",
					name: review.author_name || "Аноним",
				},
				datePublished: review.created_at || new Date().toISOString(), // Заглушка, если created_at отсутствует
				reviewBody: review.review_text,
				reviewRating: {
					"@type": "Rating",
					ratingValue: +getValidRatingOrCount(review.rating),
					bestRating: 5,
					worstRating: 1,
				},
				itemReviewed: {
					"@type": "FinancialService",
					name: review.mfo.name,
					url: `https://mfoxa.com.ua/${locale}/mfo/${review.mfo.slug}`,
				},
			},
		})),
	};

	return (
		<Script id="all-reviews-schema" type="application/ld+json">
			{JSON.stringify(reviewsSchema, null, 2)}
		</Script>
	);
};
