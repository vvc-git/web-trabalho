import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthProvider";
import RoutesApp from "./RoutesApp";

// Componente raiz da aplicação
export const App = () => {
  return (
    <>
      {/* O AuthProvider envolve os componentes filhos para fornecer o contexto de autenticação */}
      <AuthProvider>
        {/* O Router é usado para gerenciar as rotas da aplicação */}
        <Router>
          {/* O componente RoutesApp é responsável por definir as rotas da aplicação */}
          <RoutesApp />
        </Router>
      </AuthProvider>
    </>
  );
};
