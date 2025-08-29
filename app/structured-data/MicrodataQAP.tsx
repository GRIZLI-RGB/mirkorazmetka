// app/structured-data/MicrodataQAP.tsx
import Script from "next/script";
import { QuestionsResponse } from "@/app/services/questionsService";

type MicrodataQAPProps = {
  questions: QuestionsResponse["data"];
  locale: "ru" | "ua";
};

export const MicrodataQAP = ({ questions }: MicrodataQAPProps) => {
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question_text,
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
    <Script id="qap-schema" type="application/ld+json">
      {JSON.stringify(qaSchema, null, 2)}
    </Script>
  );
};