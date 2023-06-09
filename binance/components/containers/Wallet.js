import { memo } from 'react';

import styled from 'styled-components';

import useWallet from '../../state/useWallet';
import Header from '../common/Header';

const Wrapper = styled.div`
  height: 100%;
  position: relative;
`;

const CoinList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
`;

const AmountText = styled.div`
  font-size: 0.75rem;
  margin-top: 5px;
  color: #7e7e7e;
`;

const ValueText = styled.div`
  text-align: right;
`;

const CoinItem = memo(({ coin, value, amount = 0 }) => {
  return (
    <ItemWrapper>
      <div>
        {coin}
      </div>
      <div>
        <ValueText>{value}</ValueText>
        <AmountText>${amount.toFixed(2)}</AmountText>
      </div>
    </ItemWrapper>
  )
});

const Wallet = memo(({ id }) => {
  const { wallet } = useWallet(id);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  const coinElems = wallet.coins.map((coin) => (
    <CoinItem key={coin.coin} {...coin} />
  ));

  return (
    <Wrapper>
      <Header name={wallet.name} value={wallet.amount.toFixed(2)} />
      <CoinList>
        {coinElems}
      </CoinList>
    </Wrapper>
  );
});

export default Wallet;

