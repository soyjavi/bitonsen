export const parseTier = ([min, max] = [], crypto = 'BTC') => {
  const fixed = crypto === 'BTC' ? 2 : 0;

  if (min === 0 && max === undefined) return 'No limits';
  if (min === 0 && max > 0) return `First ${max} ${crypto}`;
  if (min > 0 && max > 0) return `Next ${(max - min).toFixed(fixed)} ${crypto}`;
  if (min > 0 && max === undefined) return `Above ${min} ${crypto}`;
  return `${min} - ${max}`;
};
