import { Navbar } from "./components/Navbar";
import { DeskView } from "./view/DeskView";
import React from "react";
export const App = () => {
  return (
    <div>
      <Navbar />
      <DeskView />
    </div>
  );
};
