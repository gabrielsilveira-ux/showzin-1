const StorageService = {
  getItem: (key: string) => {
    const response =
      typeof window !== "undefined" && localStorage?.getItem(key);

    if (response) {
      return JSON.parse(response);
    }
  },
  removeItem: async (key: string) =>
    typeof window !== "undefined" && localStorage?.removeItem(key),
  setItem: async (key: string, value: unknown) =>
    typeof window !== "undefined" &&
    localStorage?.setItem(key, JSON.stringify(value)),
};

export default StorageService;
