import React, { createContext } from "react";
import useAuth from "./hooks/useAuth";
import { FormValues } from "../components/FormProfile";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  loading: boolean;
  authenticated: boolean;
  typeUser: string;
  handleLogin: (values?: FormValues) => void;
  handleLogout: () => void;
}

const defaultAuthContext = {
  loading: false,
  authenticated: false,
  typeUser: "",
  handleLogin: () => {},
  handleLogout: () => {},
};

const Context = createContext<AuthContextProps>(defaultAuthContext);

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const { authenticated, loading, handleLogin, handleLogout, typeUser } =
    useAuth();

  return (
    <Context.Provider
      value={{ loading, authenticated, handleLogin, handleLogout, typeUser }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, AuthProvider };
