import { render } from '@testing-library/react';

import { waitFor, getByTestId, getByText } from '@testing-library/dom';

import { decryptKey, enryptKey } from '../../../utils/crypto';

import Wallets from '../Wallets';

const router = { push: jest.fn() };
jest.mock('next/router', () => ({
  useRouter: () => router,
}));

jest.mock('../../../state/useAuth', () => () => ({ user: { pwd: '123' } }));

jest.mock('../../../utils/crypto', () => {
  return {
    generate: jest.fn(() => ({ privateKey: 'privateKey', publicKey: 'publicKey' })),
    enryptKey: jest.fn(),
    decryptKey: jest.fn(),
    randomStr: () => 'randomStr',
  };
});

window.alert = jest.fn();
window.prompt = jest.fn(() => '123');

describe('Wallets', () => {
  it('should add new wallet on new button click', async () => {
    enryptKey.mockReturnValue('walletId1');
    const { container } = render(<Wallets />);
    const button = getByTestId(container, 'add');
    button.click();
    await waitFor(() =>
      expect(getByText(container, 'Wallet 1')).toBeTruthy(),
    );
  });

  it('should ask for password before showing wallet private key', async () => {
    enryptKey.mockReturnValue('walletId2');
    const { container } = render(<Wallets />);
    const button = getByTestId(container, 'add');
    button.click();
    await waitFor(() => {
      const button = getByTestId(container, 'showKey_walletId2');
      button.click();
      expect(window.prompt).toHaveBeenCalled();
      expect(decryptKey).toHaveBeenCalledWith('walletId2', '123');
    });
  });
});
