const MONTHS_IN_YEAR = 12;

export const calcRange = (value) => {
  if (value < MONTHS_IN_YEAR) return { value, months: value, type: `month${value > 1 ? 's' : ''}` };

  const years = (value % MONTHS_IN_YEAR) + 1;
  return { months: years * MONTHS_IN_YEAR, value: years, type: `year${years > 1 ? 's' : ''}` };
};
