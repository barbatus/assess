export const memoryStore = {
  dict: {},
  async getItem(key) {
    return this.dict[key];
  },
  async setItem(key, val) {
    this.dict[key] = val;
  },
  clear() {
    this.dict = {};
  },
};
