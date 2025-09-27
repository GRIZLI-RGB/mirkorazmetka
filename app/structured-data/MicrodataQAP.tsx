import { QuestionsResponse } from "@/app/services/questionsService";
import { PageDatesResponse } from "../services/PageDatesService";

type AnswerSchema = {
	"@type": "Answer";
	text: string;
	dateCreated: string | null;
	author: {
		"@type": "Person" | "Organization";
		name: string;
	};
};

type MicrodataQAPProps = {
	questions: QuestionsResponse["data"];
	locale: "ru" | "ua";
	dates?: PageDatesResponse | null;
};

// export const MicrodataQAP = ({ questions, dates }: MicrodataQAPProps) => {
// 	if (!questions || questions.length === 0) return null;

// 	const qaSchema = {
// 		"@context": "https://schema.org",
// 		"@type": "QAPage",
// 		datePublished: dates?.date_published,
// 		dateModified: dates?.date_modified,
// 		mainEntity: questions.map((q) => ({
// 			"@type": "Question",
// 			name: q.question_text,
// 			text: q.question_text,
// 			author: {
// 				"@type": "Person",
// 				name: q.author_name || "Аноним",
// 			},
// 			dateCreated: q.created_at,
// 			upvoteCount: q.helpful_count || 0,
// 			downvoteCount: q.not_helpful_count || 0,
// 			answerCount: q.answer_text ? 1 : 0,
// 			acceptedAnswer: q.answer_text
// 				? {
// 						"@type": "Answer",
// 						text: q.answer_text,
// 						dateCreated: q.answered_at || q.created_at,
// 						author: {
// 							"@type": "Organization",
// 							name: q.answer_author || q.mfo?.name || "MFoxa",
// 						},
// 				  }
// 				: undefined,
// 		})),
// 	};

// 	return (
// 		<script
// 			type="application/ld+json"
// 			dangerouslySetInnerHTML={{
// 				__html: JSON.stringify(qaSchema),
// 			}}
// 		/>
// 	);
// };

export const MicrodataQAP = ({ questions, dates }: MicrodataQAPProps) => {
	if (!questions || questions.length === 0) return null;

	const qaSchema = {
		"@context": "https://schema.org",
		"@type": "QAPage",
		datePublished: dates?.date_published,
		dateModified: dates?.date_modified,
		mainEntity: questions.map((q) => {
			const answers: AnswerSchema[] = [];

			// старый тип ответа
			if (q.answer_text) {
				answers.push({
					"@type": "Answer",
					text: q.answer_text,
					dateCreated: q.answered_at || q.created_at,
					author: {
						"@type": "Organization",
						name: q.answer_author || q.mfo?.name || "MFoxa",
					},
				});
			}

			// новые "ответы" приходят как replies[].question_text
			if (q.replies && q.replies.length > 0) {
				q.replies.forEach((reply) => {
					// трактуем reply.question_text как ответ
					if (reply.question_text) {
						answers.push({
							"@type": "Answer",
							text: reply.question_text,
							dateCreated: reply.created_at,
							author: {
								"@type": "Person",
								name: reply.author_name || "Аноним",
							},
						});
					}
				});
			}

			return {
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
				answerCount: answers.length,
				acceptedAnswer: answers[0] || undefined,
				suggestedAnswer:
					answers.length > 1 ? answers.slice(1) : undefined,
			};
		}),
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
