
import { useRouter } from 'next/router'

import useAuth from '../../state/useAuth';

import Wallet from '../../components/containers/Wallet';

const WalletPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Wallet id={id} />
  );
};

export default WalletPage;
