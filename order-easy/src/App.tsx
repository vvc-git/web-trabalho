import React from "react";
import { DeskView } from "./view/DeskView";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserView } from "./view/UserView";
import { FinalSummary } from "./view/FinalSummary";
import { LoginView } from "./view/LoginView";
import { ListUsersView } from "./view/ListUsersView";
import "bootstrap/dist/css/bootstrap.min.css";

export const App = () => {
  const numDesks = 28;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeskView numDesks={numDesks} />} />
        <Route path="/usuarios" element={<ListUsersView />} />
        <Route
          path="/finalizar"
          element={<FinalSummary numAccordions={numDesks} />}
        />
        <Route path="/perfil" element={<UserView perfil />} />
        <Route path="/sair" element={<LoginView />} />
      </Routes>
    </Router>
  );
};
