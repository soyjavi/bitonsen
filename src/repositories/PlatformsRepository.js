import dataSource from './dataSources/platforms.json';

export const PlatformsRepository = {
  list: () => {
    return dataSource || [];
  },
};
