import { QuestionsResponse } from "@/app/services/questionsService";
import { PageDatesResponse } from "../services/PageDatesService";

type MicrodataQAPProps = {
	questions: QuestionsResponse["data"];
	locale: "ru" | "ua";
	dates?: PageDatesResponse | null;
};

export const MicrodataQAP = ({ questions, dates }: MicrodataQAPProps) => {
	const qaSchema = {
		"@context": "https://schema.org",
		"@type": "QAPage",
		datePublished: dates?.date_published,
		dateModified: dates?.date_modified,
		mainEntity: questions.map((q) => ({
			"@type": "Question",
			name: q.question_text,
			text: q.question_text,
			author: {
				"@type": "Person",
				name: q.author_name || "Аноним",
			},
			dateCreated: q.created_at,
			upvoteCount: q.helpful_count || 0,
			downvoteCount: q.not_helpful_count || 0,
			answerCount: q.answer_text ? 1 : 0,
			acceptedAnswer: q.answer_text
				? {
						"@type": "Answer",
						text: q.answer_text,
						dateCreated: q.answered_at || q.created_at,
						author: {
							"@type": "Organization",
							name: q.answer_author || q.mfo?.name || "MFoxa",
						},
				  }
				: undefined,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(qaSchema),
			}}
		/>
	);
};
