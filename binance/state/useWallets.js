import { useCallback, useEffect, useState } from 'react';

import web3 from '../services/web3';

import useAuth from './useAuth';
import { useWalletStore } from './stores/wallets';

const useWallets = () => {
  const { user } = useAuth();
  const { addWallet, setExchange, wallets, hydrated, getPrivateKey, updateWallet } =
    useWalletStore((state) => state);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    return addWallet(user.pwd);
  }, [user]);

  useEffect(() => {
    setExchange({ BSB: '0.00724', ETH: '1489.30' });
  }, []);

  useEffect(() => {
    setTotal(wallets.reduce((acc, wallet) => wallet.amount + acc, 0));
  }, [wallets]);

  useEffect(() => {
    if (loading || loaded || !hydrated) return;

    setLoading(true);
    const promises = wallets.map((wallet) => {
      return web3.eth.getBalance(wallet.address).then((balance) => {
        updateWallet(wallet.id, 'ETH', web3.utils.fromWei(balance));
      });
    });
    Promise.allSettled(promises).then(() => {
      setLoaded(true);
      setLoading(false);
    });
  }, [wallets, loading, loaded, hydrated]);

  return { wallets, generate, total, getPrivateKey };
};

export default useWallets;