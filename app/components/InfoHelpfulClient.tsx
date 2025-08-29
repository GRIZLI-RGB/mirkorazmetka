'use client';

import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthorRandomResponse } from "../services/authorsService";
import { rateAuthor } from "../services/ratingService";

type InfoHelpfulClientProps = {
  randomAuthor?: AuthorRandomResponse;
  locale?: string;

};

export default function InfoHelpfulClient({ randomAuthor }: InfoHelpfulClientProps) {
  const t = useTranslations('infoHelpful');

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [average, setAverage] = useState<number>(randomAuthor?.data?.rating?.average || 0);
  const [totalRatings, setTotalRatings] = useState<number>(randomAuthor?.data?.rating?.total_ratings || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (ratingValue: number) => {
    if (!randomAuthor?.data?.id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await rateAuthor(randomAuthor.data.id, ratingValue, 'uk');
      setUserRating(response.data.user_rating);
      setAverage(response.data.author_average_rating);
      setTotalRatings(response.data.author_total_ratings);
    } catch {
      console.log("Помилка при оцінюванні");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-0 md:px-[20px]">
      <div className="p-[10px] sm:p-[20px] md:p-[30px] mb-[30px] md:mb-[50px] bg-white rounded-lg mt-[30px] flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left gap-[20px] sm:gap-0">
        
        {/* Author */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[20px] items-center">
          <Image
            src={randomAuthor?.data?.avatar || "/photo.svg"}
            alt={t("photoAlt")}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex flex-col gap-[5px] items-center sm:items-start">
            <p className="font-bold text-[20px] leading-[100%] text-[#222]">
              {randomAuthor?.data?.name || t("authorName")}
            </p>
            <p className="font-medium text-[11px] leading-[145%] text-[#67677a]">
              {randomAuthor?.data?.role || t("authorRole")}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-[10px] items-center sm:items-start">
          <p className="font-bold text-[20px] leading-[100%] text-[#222]">
            {t("question")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-[10px]">
            <div className="flex gap-[10px]">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoverRating
                  ? star <= hoverRating
                  : userRating
                  ? star <= userRating
                  : star <= Math.round(average);

                return (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(star)}
                  >
                    {isFilled ? (
                      <path
                        d="M13 0L15.9187 8.98278H25.3637L17.7225 14.5344L20.6412 23.5172L13 17.9656L5.35879 23.5172L8.27747 14.5344L0.636266 8.98278H10.0813L13 0Z"
                        fill="#724DEA"
                      />
                    ) : (
                      <path
                        d="M15.4434 9.1377L15.5557 9.48242H23.8252L17.4287 14.1299L17.1348 14.3438L17.2471 14.6885L19.6895 22.207L13.2939 17.5615L13 17.3477L12.7061 17.5615L6.30957 22.207L8.75293 14.6885L8.86523 14.3438L8.57129 14.1299L2.1748 9.48242H10.4443L10.5566 9.1377L13 1.61719L15.4434 9.1377Z"
                        stroke="#BCBCCC"
                      />
                    )}
                  </svg>
                );
              })}
            </div>

            <p className="font-medium text-[11px] leading-[145%] text-[#222]">
              {totalRatings + t("ratingTextTotalRatings") + average + t("ratingTextAverage")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
