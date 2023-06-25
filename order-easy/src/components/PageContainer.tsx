/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Interpolation } from "emotion";
import React from "react";

export interface PageContainerProps {
  children?: React.ReactNode;
  style?: Interpolation;
}

export function PageContainer(props: PageContainerProps) {
  const { children, style } = props;

  return <div css={[container, style]}>{children}</div>;
}

const container = css`
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  max-width: 1600px;
`;
