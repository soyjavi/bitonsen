const MONTHS_IN_YEAR = 12;

export const parseMonths = (months) => {
  if (months < MONTHS_IN_YEAR) return `${months} month${months > 1 ? 's' : ''}`;

  const years = months / MONTHS_IN_YEAR;
  return `${years} year${years > 1 ? 's' : ''}`;
};
