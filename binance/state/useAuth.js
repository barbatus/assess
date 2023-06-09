import { useCallback, useEffect, useState, useMemo, createContext, useContext } from 'react';
import { useRouter, use } from 'next/router';
import createReactStore from 'zustand';

import { hashStr } from '../utils/crypto';
import { IndexedDBStorage } from '../utils/idb';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const contextValue = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

const defaultOptions = { authPath: '/auth', store: process.browser ? new IndexedDBStorage() : {} };
const useAuth = (options) => {
  const { authPath, store } = { ...defaultOptions, ...options };
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user && router.pathname === authPath) {
      router.push(router.query.from || '/');
    }
    if (!user && router.pathname !== authPath) {
      router.push(authPath + `?from=${location.pathname}`);
    }
  }, [user]);

  const authMe = useCallback(async (pwd) => {
    return store.getItem('appUser').then(async (user) => {
      const hashPwd = hashStr(pwd);
      if (!user) {
        const newUser = { hashPwd };
        await store.setItem('appUser', newUser);
        setUser({ ...newUser, pwd });
        return true;
      } else if (user.hashPwd === hashPwd) {
        setUser({ ...user, pwd });
        return false;
      } else {
        throw new Error('Invalid password');
      }
    });
  }, []);

  return { authMe, user };
};

export default useAuth;
