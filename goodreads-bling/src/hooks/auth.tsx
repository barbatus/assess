import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { User } from "@prisma/client";

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
    if (user && location.pathname === "/login") {
      window.location.href = window.location.origin;
    }
  }, [user, location]);

  const authMe = useCallback(async () => {
    const user = (await fetch("/api/auth").then((res) => res.json())) as User;
    setUser(user);
  }, []);

  return { authMe, user };
};
