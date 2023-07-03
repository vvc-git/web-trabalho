/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Interpolation } from "emotion";
import React from "react";

// Interface dos tipos dos objetos das props do componente
export interface PageContainerProps {
  children?: React.ReactNode;
  style?: Interpolation;
}

// Componente do container do conteúdo do sistema
export function PageContainer(props: PageContainerProps) {
  const { children, style } = props;

  // Retorna o container
  return <div css={[container, style]}>{children}</div>;
}

// Estilos CSS utilizando a biblioteca emotion
const container = css`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  max-width: 1600px;
`;
