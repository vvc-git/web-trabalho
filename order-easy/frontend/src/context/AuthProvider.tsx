import React, { createContext } from "react";
import useAuth from "./hooks/useAuth";
import { FormValues } from "../components/FormProfile";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  loading: boolean;
  authenticated: boolean;
  handleLogin: (values?: FormValues) => void;
  handleLogout: () => void;
}

const defaultAuthContext = {
  loading: false,
  authenticated: false,
  handleLogin: () => {},
  handleLogout: () => {},
};

const Context = createContext<AuthContextProps>(defaultAuthContext);

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const { authenticated, loading, handleLogin, handleLogout } = useAuth();

  return (
    <Context.Provider
      value={{ loading, authenticated, handleLogin, handleLogout }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, AuthProvider };
