/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Navbar from "./components/Navbar";
import DeskView from "./view/DeskView";

export default function App() {
  const globalDivStyles = css`
    font-family: "IBM Plex Sans bold", sans-serif;
  `;

  return (
    <div css={globalDivStyles}>
      <Navbar />
      <DeskView />
    </div>
  );
}
