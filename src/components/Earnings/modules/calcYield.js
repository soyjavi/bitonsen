import { PlatformsRepository } from '../../../repositories';

export const calcYield = (amount, crypto) => {
  let tiers = PlatformsRepository.tiers(crypto);

  // !TODO: Improve "algo" -----------------------------------------------------
  tiers = tiers.sort((a, b) => (a.yield <= b.yield ? 1 : -1));
  const { yield: maxYield } = tiers[0];
  // !TODO: Improve "algo" -----------------------------------------------------

  return maxYield / 100;
};
