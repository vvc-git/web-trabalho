/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Text } from "bold-ui";
import React from "react";

export interface TotalProps {
  value: number;
}

export function Total(props: TotalProps) {
  const { value } = props;

  return (
    <div css={divTotalStyles}>
      <Text style={totalStyles}>Total: R${value.toFixed(2)}</Text>
    </div>
  );
}

const totalStyles = css`
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
`;

const divTotalStyles = css`
  display: flex;
  text-align: center;
  align-items: center;
  padding: 0 20px;
  height: 3rem;
  border: 1px solid rgb(208, 30, 41);
  background-color: rgb(208, 30, 41);
  border-radius: 20px;
  width: max-content;
`;
