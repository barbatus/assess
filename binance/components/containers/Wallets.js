import { memo, useCallback } from 'react';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { faEye, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import useWallets from '../../state/useWallets';
import useAuth from '../../state/useAuth';

import Header from '../common/Header';
import { Circle, ButtonIcon } from '../common/Button';

const Wrapper = styled.div`
  height: 100%;
  position: relative;
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const AddButton = styled(Circle)`
  bottom: 10px;
  right: 10px;
`;

const ArrowRight = styled(ButtonIcon)`
  margin-left: 10px;
`;

const ShowKeyButton = styled(ButtonIcon)`
  position: absolute;
  left: 100px;
`;

const WalletItem = memo(({ id, name, amount, onClick, onShowKey }) => {
  const onItemClick = useCallback((e) => {
    onClick(id);
  }, [id, onClick]);

  const onShowKeyClick = useCallback((e) => {
    e.stopPropagation();
    onShowKey(id);
  }, [id, onShowKey]);

  return (
    <ItemWrapper onClick={onItemClick}>
      <div>
        {name}
      </div>
      <div>
        <ShowKeyButton data-testid={`showKey_${id}`} icon={faEye} onClick={onShowKeyClick}></ShowKeyButton>
        ${amount.toFixed(2)}
        <ArrowRight icon={faAngleRight}></ArrowRight>
      </div>
    </ItemWrapper>
  )
});

const Wallets = () => {
  const { wallets, generate, total, getPrivateKey } = useWallets();
  const router = useRouter();
  const { user } = useAuth();

  const onNewWallet = useCallback(async () => {
    const wallet = await generate();
    alert(`
      This is Wallet's private key.
      Please, write it down and keep it safe.
      ${await getPrivateKey(wallet.id, user.pwd)}
    `);
  }, [user, generate, getPrivateKey]);

  const onWallet = useCallback((id) => {
    router.push(`/wallet/${id}`);
  }, [router]);

  const onShowKey = useCallback(async (walletId) => {
    const pwd = prompt('Please, enter your password');
    if (user.pwd !== pwd) {
      alert('Wrong password');
      return;
    }
    alert(`
      Private key
      ${await getPrivateKey(walletId, pwd)}
    `);
  }, [user, getPrivateKey]);

  const walletElems = wallets.map((wallet) => (
    <WalletItem key={wallet.id} {...wallet} onClick={onWallet} onShowKey={onShowKey} />
  ));

  return (
    <Wrapper>
      <Header name="All Wallets" value={total.toFixed(2)} />
      <WalletList>
        {walletElems}
      </WalletList>
      <AddButton data-testid="add" onClick={onNewWallet} />
    </Wrapper>
  )
};

export default Wallets;