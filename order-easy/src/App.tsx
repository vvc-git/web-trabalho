import React from "react";
import { FinalSummary } from "./view/FinalSummary";
import "bootstrap/dist/css/bootstrap.min.css";

export const App = () => {
  const numDesks = 12;

  return (
    <>
      <FinalSummary numAccordions={numDesks}></FinalSummary>
    </>
  );
};
