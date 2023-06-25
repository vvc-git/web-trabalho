/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Button, Cell, Grid, TextField } from "bold-ui";

export function FormLogin() {
  return (
    <>
      <Grid gap={2} gapVertical={1} justifyContent="flex-start">
        <Cell lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Usuário"
            placeholder="CPF"
            style={inputStyles}
            required
          />
        </Cell>
        <Cell lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Senha"
            placeholder="Senha"
            type="password"
            style={inputStyles}
            required
          />
        </Cell>
        <Cell lg={12} md={12} sm={12} xs={12}>
          <Button kind="primary" size="medium" style={buttonStyles}>
            Entrar
          </Button>
        </Cell>
      </Grid>
    </>
  );
}

const buttonStyles = css`
  width: 100%;
`;

const inputStyles = css`
  width: 100%;
  min-height: 38px;
  border-color: hsl(0, 0%, 80%) !important;
  border-radius: 4px !important;
  font-size: 1rem;
`;
