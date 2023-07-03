import { useState, useEffect } from "react";

import { FormValues } from "../../components/FormProfile";
import api from "../../api";
import { useHistory } from "react-router-dom";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [typeUser, setTypeUser] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const type = localStorage.getItem("type");

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
      const response = await api.post("/login", values);
      const { token, user, type } = response.data;

      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", user);
      localStorage.setItem("type", type);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthenticated(true);
      history.push("/");
    } catch (error) {
      throw error;
    }
  };

  function handleLogout() {
    setAuthenticated(false);

    localStorage.removeItem("token");

    delete api.defaults.headers.common["Authorization"];

    window.location.href = "/auth";
  }

  return {
    authenticated,
    loading,
    handleLogin,
    handleLogout,
    typeUser,
  };
}
