'use client';
import React, { useState } from "react";

type DetailsTextProps = {
  html?: string;
};

const DetailsText: React.FC<DetailsTextProps> = ({ html }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const fullHtml = html ?? "";
  const previewCharCount = 300;

  const getTextFromHTML = (html: string) => {
    return html.replace(/<[^>]*>?/gm, ''); // Простое удаление тегов
  };

  const getTruncatedHtml = (htmlString: string) => {
    const textContent = getTextFromHTML(htmlString);
    return textContent.slice(0, previewCharCount) + "...";
  };

  const shouldTruncate = fullHtml.length > previewCharCount;
  const displayedContent = isExpanded || !shouldTruncate
    ? fullHtml
    : getTruncatedHtml(fullHtml);

  return (
    <div className="px-0 md:px-[20px]">
      <div
        className="mb-[10px] text-[13px] md:text-[15px]"
        style={{
          fontFamily: "var(--Montserrat)",
          fontWeight: 500,
          lineHeight: "138%",
          color: "#222",
        }}
        dangerouslySetInnerHTML={{ __html: displayedContent }}
      />

      {shouldTruncate && (
        <p
          className="mb-[30px] w-max md:mb-[50px] text-[13px] md:text-[15px] cursor-pointer underline text-[#724dea] transition-colors duration-200 hover:text-[#9278ea]"
          style={{
            fontFamily: "var(--Montserrat)",
            fontWeight: 500,
            lineHeight: "138%",
            textDecorationSkipInk: "none",
          }}
          onClick={toggleExpanded}
        >
          {isExpanded ? "Скрыть" : "Показать полностью"}
        </p>
      )}
    </div>
  );
};

export default DetailsText;
