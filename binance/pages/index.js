import Layout from '../components/common/Layout';

import Wallets from '../components/containers/Wallets';
import useAuth from '../state/useAuth';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Wallets />
  );
}
