import { useCallback, useState, useEffect } from 'react';

import web3 from '../services/web3'
import { useWalletStore } from './stores/wallets';;

const useWallet = (walletId) => {
  const { wallet, hydrated, updateWallet } = useWalletStore((state) =>
    ({
      wallet: state.wallets.find(({ id }) => id === walletId),
      hydrated: state.hydrated,
      updateWallet: state.updateWallet,
    }));
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading || loaded || !hydrated) return;

    setLoading(true);
    web3.eth.getBalance(wallet.address).then((balance) => {
      updateWallet(wallet.id, 'ETH', web3.utils.fromWei(balance));
    }).finally(() => {
      setLoaded(true);
      setLoading(false);
    });
  }, [wallet, loading, loaded, hydrated]);

  return { wallet };
};

export default useWallet;
