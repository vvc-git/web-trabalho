import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./Context/AuthProvider";
import RoutesApp from "./RoutesApp";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <RoutesApp />
      </Router>
    </AuthProvider>
  );
};
