import { useState, useEffect } from "react";

import { FormValues } from "../../components/FormProfile";
import api from "../../api";
import { useHistory } from "react-router-dom";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false); // Estado para controlar se o usuário está autenticado
  const [typeUser, setTypeUser] = useState(""); // Estado para armazenar o tipo de usuário
  const [loading, setLoading] = useState(true); // Estado para controlar se a autenticação está sendo carregada
  const history = useHistory(); // Objeto do histórico de navegação

  useEffect(() => {
    // Obtém as informações do localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const type = localStorage.getItem("type");

    // se recebe o token define o cabeçalho de autorização da API com o token e usuário, e define o tipo de usuário
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        api.defaults.headers.Authorization = `Bearer ${parsedToken}`;
        api.defaults.headers.User = user;
        setAuthenticated(true);
        type && setTypeUser(type);
      } catch (error) {
        console.error("Erro ao analisar o token JSON:", error);
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = async (values?: FormValues) => {
    try {
      // faz requisição para o login no backend e pega os valores
      const response = await api.post("/login", values);
      const { token, user, type } = response.data;

      // Armazena os valores no localStorage
      localStorage.setItem("token", JSON.stringify(token)); // transforma o token em um json
      localStorage.setItem("user", user);
      localStorage.setItem("type", type);

      // Define o cabeçalho de autorização da API com o token
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthenticated(true); // Define o estado de autenticação como verdadeiro
      history.push("/"); // redireciona para  a pagina principal
    } catch (error) {
      throw error;
    }
  };

  function handleLogout() {
    // Define o estado de autenticação como falso
    setAuthenticated(false);

    // Define o tipo de usuário como vazio
    setTypeUser("");

    // Remove o token, user e type do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("type");

    // Remove o cabeçalho de autorização da API
    delete api.defaults.headers.common["Authorization"];

    // redireciona para a rota de login
    window.location.href = "/auth";
  }

  // retorna os dados necessários
  return {
    authenticated,
    loading,
    handleLogin,
    handleLogout,
    typeUser,
  };
}
