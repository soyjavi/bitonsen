import { StorageRepository } from './StorageRepository';

const STORAGE_KEY = 'bitsento::rates';
const SERVICE_URL = 'https://ledgernode.glitch.me/rates?baseCurrency=BTC&latest=true';

export const RatesRepository = {
  cache: () => {
    return StorageRepository.get(STORAGE_KEY) || {};
  },
  get: () => {
    return new Promise((resolve) => {
      fetch(SERVICE_URL)
        .then((response) => response.json())
        .then((value = {}) => {
          const [key] = Object.keys(value);
          const data = RatesRepository.cache();

          if (key && value[key].USD) data.BTC = parseInt(value[key].USD, 10);

          StorageRepository.set(STORAGE_KEY, data);
          resolve(data);
        });
    });
  },
};
