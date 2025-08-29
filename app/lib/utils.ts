export const getValidRatingOrCount = (
	value: string | number,
	isCount = false
): string => {
	const num = +value;

	return num ? String(value) : isCount ? "100" : "4.5";
};
