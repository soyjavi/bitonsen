import { CRYPTO, SYMBOL } from '../../../modules/constants';

export const parseTier = ([min, max] = [], crypto = CRYPTO.BTC) => {
  const fixed = crypto === 'BTC' ? 2 : 0;
  const symbol = SYMBOL[crypto];

  if (min === 0 && max === undefined) return 'No limits';
  if (min === 0 && max > 0) return `First ${max} ${symbol}`;
  if (min > 0 && max > 0) return `Next ${(max - min).toFixed(fixed)} ${symbol}`;
  if (min > 0 && max === undefined) return `Above ${min} ${symbol}`;
  return `${min} - ${max}`;
};
