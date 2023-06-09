import createReactStore from 'zustand';
import create from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

import { generate, enryptKey, decryptKey, randomStr, COINS } from '../../utils/crypto';

import { IndexedDBStorage } from '../../utils/idb';
import web3 from '../../services/web3';

import { memoryStore } from './utils';

const newWallet = async (name, secret, keyGenerator) => {
  const { privateKey, address } = keyGenerator();
  const walletId = await enryptKey(privateKey, secret);
  const coins = [{ coin: 'ETH', value: '0' }];
  return {
    id: walletId,
    address,
    name,
    amount: 0,
    coins: [],
  };
};

const setCoins = (wallet, exchange) => {
  const coins = wallet.coins.map((coin) => {
    return {
      ...coin,
      amount: parseFloat(coin.value) * (parseFloat(exchange[coin.coin]) || 1),
    };
  });
  const amount = coins.reduce((acc, coin) => acc + coin.amount, 0);
  return { ...wallet, coins, amount };
};

const defaultStore = process.browser ? new IndexedDBStorage() : memoryStore;

export const createWalletStore = (store = defaultStore, keyGenerator = generate) => create(
  persist(
    (set, get) => ({
      exchange: {},
      wallets: [],
      hydrated: false,
      setHasHydrated: (state) => {
        set({
          hydrated: true,
        });
      },
      async getPrivateKey(walletId, secret) {
        return await decryptKey(walletId, secret);
      },
      async addWallet(secret) {
        const { wallets, exchange } = get();
        const wallet = await newWallet(`Wallet ${wallets.length + 1}`, secret, keyGenerator);
        const withCoins = setCoins(wallet, exchange);
        set({ wallets: [...wallets, withCoins] });
        return withCoins;
      },
      updateWallet(walletId, coin, value) {
        if (!COINS.includes(coin)) throw new Error(`Invalid coin ${coin}`);

        const { wallets, exchange } = get();
        const wallet = wallets.find((w) => w.id === walletId);
        const coins = wallet.coins.filter((it) => it.coin !== coin);
        const withCoins = setCoins({ ...wallet, coins: [...coins, { coin, value }] }, exchange);
        set({ wallets: [...wallets.filter((w) => w.id !== walletId), withCoins] });
      },
      setExchange(data) {
        const { wallets, exchange } = get();
        const shouldUpdate = Object.keys(data).some((key) => {
          return data[key] !== exchange[key];
        });
        if (!shouldUpdate) return;

        const updated = wallets.map((wallet) => {
          return setCoins(wallet, exchange);
        });
        set({ wallets: updated, exchange: data });
      },
    }),
    {
      name: 'wallets',
      getStorage: () => store,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      }
    },
  ),
);

export const useWalletStore = createReactStore(createWalletStore(defaultStore, () => {
  const keys = web3.eth.accounts.create();
  return { address: keys.address, privateKey: keys.privateKey.substr(2) };
}));
