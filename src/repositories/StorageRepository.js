export const StorageRepository = {
  get: (key) => {
    return JSON.parse(localStorage.getItem(key)) || {};
  },

  set: (key, value) => {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  },
};
