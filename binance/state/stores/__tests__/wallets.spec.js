import { randomStr } from '../../../utils/crypto';
import { createWalletStore } from '../wallets';
import { memoryStore } from '../utils';

const privateKey = randomStr();
const publicKey = randomStr();
const store = createWalletStore(memoryStore, () => ({ privateKey, publicKey }));

async function findStoreWallet(id) {
  const { state } = JSON.parse(await memoryStore.getItem('wallets'));
  return state.wallets.find(w => w.id === id);
}

describe('WalletStore', () => {
  afterEach(() => {
    memoryStore.clear();
  });

  it('should not save private key in plain text', async () => {
    const { getState } = store;
    const { addWallet } = getState();
    const { id } = await addWallet('secret');
    const wallet = await findStoreWallet(id);
    expect(wallet).toBeDefined();
    Object.keys(wallet).forEach(key => {
      expect(wallet[key]).not.toEqual(privateKey);
    });
  });

  it('should get private key from wallet ID', async () => {
    const { getState } = store;
    const { addWallet, getPrivateKey } = getState();
    const { id } = await addWallet('123');
    const wallet = await findStoreWallet(id);
    const walletKey = await getPrivateKey(wallet.id, '123');
    expect(walletKey).toEqual(privateKey);
  });
});
