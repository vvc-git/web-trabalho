import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeskView } from "./view/DeskView";

export const App = () => {
  const numDesks = 28;

  return (
    <>
      <DeskView numDesks={numDesks}></DeskView>
    </>
  );
};
