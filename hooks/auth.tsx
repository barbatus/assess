import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

import { User } from "~/prisma/generated/type-graphql";

export const AuthContext = createContext<{ user: User | null; setUser: (user: User) => void }>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const contextValue = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [user, router]);

  const authMe = useCallback(async () => {
    const user = (await fetch("/api/auth").then((res) => res.json())) as User;
    setUser(user);
  }, []);

  return { authMe, user };
};
