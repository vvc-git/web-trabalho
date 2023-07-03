import React, { createContext } from "react";
import useAuth from "./hooks/useAuth";
import { FormValues } from "../components/FormProfile";

// Tipos de propriedades para o AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Tipos de propriedades para o contexto de autenticação
interface AuthContextProps {
  loading: boolean;
  authenticated: boolean;
  typeUser: string;
  handleLogin: (values?: FormValues) => void;
  handleLogout: () => void;
}

// Valor padrão para o contexto de autenticação
const defaultAuthContext = {
  loading: false,
  authenticated: false,
  typeUser: "",
  handleLogin: () => {},
  handleLogout: () => {},
};

// Criação do contexto de autenticação
const Context = createContext<AuthContextProps>(defaultAuthContext);

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const { authenticated, loading, handleLogin, handleLogout, typeUser } =
    useAuth(); // Utiliza o hook useAuth para obter as propriedades e funções relacionadas à autenticação

  return (
    <Context.Provider
      value={{ loading, authenticated, handleLogin, handleLogout, typeUser }} // Define os valores do contexto com as propriedades e funções obtidas do useAuth
    >
      {children}
    </Context.Provider>
  );
};

export { Context, AuthProvider };
