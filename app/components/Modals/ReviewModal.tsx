/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createReview } from "@/app/services/reviewService";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mfoId: number;
  mfoName: string;
};

const Star = ({ active }: { active: boolean }) => (
  <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
    <path
      d="M13 0L15.92 8.98H25.36L17.72 14.53L20.64 23.52L13 17.97L5.36 23.52L8.28 14.53L0.64 8.98H10.08L13 0Z"
      fill={active ? "#724DEA" : "#BCBCCC"}
    />
  </svg>
);

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <div
    onClick={onChange}
    className="w-[14px] h-[14px] rounded-[2px] border border-[#724DEA] flex items-center justify-center cursor-pointer"
  >
    {checked && (
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6L5 9L10 3"
          stroke="#724DEA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

const ratingFields = [
  "Скорость выдачи",
  "Условия",
  "Служба поддержки",
  "Удобство сайта",
];

export default function ReviewModal({
  isOpen,
  onClose,
  mfoId,
  mfoName,
}: ReviewModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (title: string, value: number) => {
    setRatings((prev) => ({ ...prev, [title]: value }));
  };

  const handleSubmit = async () => {
    const speed = ratings["Скорость выдачи"];
    const conditions = ratings["Условия"];
    const support = ratings["Служба поддержки"];
    const website = ratings["Удобство сайта"];

    if (
      !name ||
      !email ||
      !text ||
      !speed ||
      !conditions ||
      !support ||
      !website
    ) {
      toast.error("Пожалуйста, заполните все поля и поставьте оценки.");
      return;
    }

    if (!agreePolicy) {
      toast.error("Вы должны принять политику конфиденциальности.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createReview({
        mfo_id: mfoId,
        author_name: name,
        author_email: email,
        review_text: text,
        speed_rating: speed,
        conditions_rating: conditions,
        support_rating: support,
        website_rating: website,
      });
      toast.success("Отзыв отправлен и отправлен на модерацию!");

      // Clear form after successful submission
      setRatings({});
      setName("");
      setEmail("");
      setText("");
      setAgreePolicy(false);

      onClose();
    } catch (error: any) {
      const errorMessage = error?.message || "Ошибка при отправке отзыва.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center text-black">
      <div
        style={{ scrollbarWidth: "none" }}
        className="bg-white text-black w-[335px] max-h-[calc(100vh-40px)] overflow-y-auto rounded-[8px] border border-[#ebebf9] p-[14px] relative"
      >
        <div className="flex justify-between items-center mb-[14px]">
          <h2
            className="font-bold text-[20px] text-[#222]"
            style={{ fontFamily: "var(--second-family)" }}
          >
            Написать отзыв {mfoName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-[#222] hover:text-[#724DEA] transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1.24 1L8 7.88M8 7.88L15 15M8 7.88L1 15M8 7.88L14.76 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p
          className="font-medium text-[13px] text-[#222] mb-[14px]"
          style={{ fontFamily: "var(--font-family)" }}
        >
          Оцените {mfoName}
        </p>

        {ratingFields.map((title) => (
          <div key={title} className="mb-[10px]">
            <p
              className="text-[10px] font-medium text-[#222] mb-[5px]"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {title}
            </p>
            <div className="flex gap-[10px]">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  onClick={() => handleStarClick(title, n)}
                  className="cursor-pointer"
                >
                  <Star active={n <= (ratings[title] || 0)} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {["Имя", "E-mail", "Отзыв"].map((label, i) => (
          <div key={i} className="mb-[14px]">
            <p
              className="text-[13px] text-[#222]"
              style={{ fontFamily: "var(--third-family)" }}
            >
              {label}
            </p>
            {label === "Отзыв" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border border-[#e0e0e0] rounded-[6px] px-3 py-2 w-[307px] h-[119px] bg-white resize-none"
              />
            ) : (
              <input
                value={label === "Имя" ? name : email}
                onChange={(e) => {
                  const val = e.target.value;
                  if (label === "Имя") setName(val);
                  else setEmail(val);
                }}
                className="border border-[#e0e0e0] rounded-[6px] px-3 py-2 w-[307px] h-[40px] bg-white"
              />
            )}
          </div>
        ))}

        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="bg-[#00ba9e] text-white font-bold text-[14px] rounded-[8px] px-[16px] py-[9.5px] w-full text-center mb-[14px] disabled:opacity-50"
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </button>

        <div
          className="flex items-start gap-[8px] mb-[14px] cursor-pointer"
          onClick={() => setAgreePolicy(!agreePolicy)}
        >
          <Checkbox
            checked={agreePolicy}
            onChange={() => setAgreePolicy(!agreePolicy)}
          />
          <p
            className="flex-1 text-[12px] text-[#222] font-medium leading-[142%]"
            style={{ fontFamily: "var(--font-family)" }}
          >
            Я принимаю условия обработки персональных данных, указанных
            в Политике конфиденциальности
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
