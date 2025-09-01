"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
// import { BreadcrumbList } from "../structured-data/BreadcrumbList";

type BreadProps = {
	lang: "ru" | "ua";
};

const translations: Record<string, { ru: string; ua: string }> = {
	loan: { ru: "Займы", ua: "Позики" },
	reviews: { ru: "Отзывы", ua: "Відгуки" },
	contacts: { ru: "Контакты", ua: "Контакти" },
	promotion: { ru: "Акции", ua: "Акції" },
	qap: { ru: "Вопросы", ua: "Питання" },
	catalog: { ru: "Каталог МФО", ua: "Каталог МФО" },
	mfo: { ru: "Рейтинг МФО", ua: "Рейтинг МФО" }, // 👈 добавь это
	about: { ru: "О нас", ua: "Про нас" }, // 👈 добавь это
};

const Bread = ({ lang }: BreadProps) => {
	const pathname = usePathname();

	const segments = useMemo(() => {
		if (!pathname) return [];
		const parts = pathname.split("/").filter(Boolean);

		// Убираем язык (первый сегмент: "ru" или "ua")
		return parts.slice(1);
	}, [pathname]);
	const breadcrumbs = useMemo(() => {
		let href = lang === "ru" ? "/ru" : "/";
		return segments.map((segment, index) => {
			href += `/${segment}`;
			const isMfoRoot = segment === "mfo" && segments.length > index + 1;
			const label =
				segment === "mfo"
					? segments.length === 1
						? translations["mfo"]?.[lang] // ✅ "/mfo" => "Рейтинг МФО"
						: translations["loan"]?.[lang] // ✅ "/mfo/xxx" => "Позики"
					: translations[segment]?.[lang] ||
					  decodeURIComponent(segment);

			return {
				label,
				href: isMfoRoot ? (lang === "ru" ? "/ru/loan" : "/loan") : href,
			};
		});
	}, [segments, lang]);

	return (
		<>
			{/* <BreadcrumbList lang={lang} /> */}
			<div
				className="p-[10px] md:pl-[20px] my-[10px] flex gap-[9px] text-[#222] text-[12px] font-medium leading-[142%]"
				style={{ fontFamily: "var(--Montserrat)" }}
			>
				<Link href={lang === "ru" ? "/ru" : "/"}>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8.00887 1.5L1 6.59091V15.5H6.35247L6.35235 11.0267H9.64753V15.5H15V6.59091L8.00887 1.5Z"
							stroke="#222222"
						/>
					</svg>
				</Link>

				{breadcrumbs.map((crumb, i) => (
					<div key={i} className="flex items-center gap-[9px]">
						<span>/</span>
						{i === breadcrumbs.length - 1 ? (
							<span>{crumb.label}</span>
						) : (
							<Link href={crumb.href}>{crumb.label}</Link>
						)}
					</div>
				))}
			</div>
		</>
	);
};

export default Bread;
