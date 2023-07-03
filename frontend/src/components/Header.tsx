/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { VFlow } from "bold-ui";
import React from "react";
import { PageContainer } from "./PageContainer";
import { Menu } from "./Menu";

interface HeaderProps {
  title: string;
}

const whitePattern = require("../img/padrao-branco-header.png");

// Componente de cabeçalho para as páginas
export function Header(props: HeaderProps) {
  const { title } = props;

  return (
    <VFlow vSpacing={3}>
      <div css={headerStyles}>
        <div css={backgroundStyles}></div>
        <Menu></Menu>
        <PageContainer>
          <h1 css={titleHeaderStyles}>{title}</h1>
        </PageContainer>
      </div>
    </VFlow>
  );
}

// Estilos CSS utilizando a biblioteca emotion
const headerStyles = css`
  background-color: #0069d0;
  position: relative;
  width: 100%;
  text-align: left;
  margin: 0 auto;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const backgroundStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  width: 40%; /* Apenas metade direita */
  height: 100%;
  background-image: url(${whitePattern});
  background-size: cover;
  background-position: center;

  @media (max-width: 890px) {
    display: none; /* Oculta a imagem com largura máxima de 890px */
  }
`;

const titleHeaderStyles = css`
  color: white;
  font-weight: bold !important;
`;
