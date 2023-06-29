import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./Context/AuthProvider";
import RoutesApp from "./RoutesApp";

export const App = () => {
  const numDesks = 28;

  return (
    <AuthProvider>
      <Router>
        <RoutesApp />
      </Router>
    </AuthProvider>
  );
};
