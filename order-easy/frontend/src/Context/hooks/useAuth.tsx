import { useState, useEffect } from "react";

import { FormValues } from "../../components/FormProfile";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    localStorage.getItem("user");

    if (token) {
      axios.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleLogin = async (values?: FormValues) => {
    try {
      const response = await axios.post("http://localhost:4000/login", values);
      const { token, user } = response.data;

      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", user);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthenticated(true);
      history.push("/");
    } catch (error) {
      throw error;
    }
  };

  function handleLogout() {
    setAuthenticated(false);

    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];

    window.location.href = "/auth";
  }

  return { authenticated, loading, handleLogin, handleLogout };
}
