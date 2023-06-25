/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, TextField, VFlow } from "bold-ui";
import { Fragment } from "react";
import React from "react";
import { Header } from "../components/Header";

interface RegisterViewProps {
  num?: number;
}

export function RegisterView(props: RegisterViewProps) {
  const { num } = props;

  return (
    <VFlow>
      <Header title="Cadastrar usuário"></Header>
      <Grid gap={2} gapVertical={1} justifyContent="flex-start">
        <Cell lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Nome completo"
            placeholder="Ex.: João da Silva Pereira"
            style={inputStyles}
            required
          />
        </Cell>
        <Cell lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Senha"
            placeholder="Escolha uma senha forte"
            type="password"
            style={inputStyles}
            required
          />
        </Cell>
        <Cell lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Confirme sua senha"
            placeholder="Digite novamente a senha"
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
    </VFlow>
  );
}

const gridStyles = css`
  width: 100%;
`;
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
