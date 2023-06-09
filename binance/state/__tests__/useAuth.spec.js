import { renderHook } from '@testing-library/react';

import useAuth from '../useAuth';

import { memoryStore } from '../stores/utils';

const router = { push: jest.fn() };
jest.mock('next/router', () => ({
  useRouter: () => router,
}));

window.alert = jest.fn();

describe('useAuth', () => {
  afterEach(() => {
    memoryStore.clear();
  });

  it('should redirect to the auth page when there is no user', async () => {
    const { result } = renderHook(() => useAuth({ store: memoryStore }));
    expect(router.push).toHaveBeenCalledWith('/auth');
  });

  it('should create user and save it in the auth store without password', async () => {
    const { result } = renderHook(() => useAuth({ store: memoryStore }));
    const { authMe } = result.current;
    await authMe('pwd123');
    const user = await memoryStore.getItem('appUser');
    expect(user).toBeDefined();
    Object.keys(user).forEach(key => {
      expect(user[key]).not.toEqual('pwd123');
    });
  });

  it('should throw exception when password does not match on login', async () => {
    await memoryStore.setItem('appUser', { hashPwd: 'hashedpwd' });
    const { result } = renderHook(() => useAuth({ store: memoryStore }));
    const { authMe } = result.current;
    await expect(authMe('pwd123')).rejects.toThrow('Invalid password');
  });
});
