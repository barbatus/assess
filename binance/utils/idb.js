import { openDB } from 'idb';

export class IndexedDBStorage {
  dbName = null;

  dbPromise = null;

  constructor(dbName = 'wallets-store') {
    this.dbName = dbName;
    this.dbPromise = openDB(this.dbName, 2, {
      upgrade: (db, oldVer, newVer) => {
        if (oldVer !== newVer) {
          const stores = Array.from(db.objectStoreNames);
          if (stores.includes('keyval')) {
            db.deleteObjectStore('keyval');
          }
        }
        db.createObjectStore('keyval');
      },
    });
  }

  async getItem(key) {
    return (await this.dbPromise).get('keyval', key);
  }

  async setItem(key, val) {
    return (await this.dbPromise).put('keyval', val, key);
  }

  async removeItem(key) {
    return (await this.dbPromise).delete('keyval', key);
  }
}
