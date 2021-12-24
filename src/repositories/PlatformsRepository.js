import dataSource from './dataSources/platforms.json';

export const PlatformsRepository = {
  list: () => {
    return dataSource || [];
  },
  tiers: (crypto) => {
    const values = [];

    (dataSource || []).forEach(({ tiers = [] }) =>
      tiers.forEach((tier) => {
        if (tier.crypto === crypto) values.push(tier);
      }),
    );

    return values;
  },
};
