/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, Select, TextField, VFlow } from "bold-ui";
import React from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";

interface UserViewProps {
  num?: number;
  perfil?: boolean;
}

export function UserView(props: UserViewProps) {
  const { num, perfil } = props;

  return (
    <VFlow>
      <Header title={perfil ? "Perfil" : "Cadastrar usuário"}></Header>
      <PageContainer>
        <Grid gap={2} gapVertical={1} justifyContent="flex-start">
          <Cell lg={8} md={8} sm={8} xs={12}>
            <TextField
              label="Nome completo"
              placeholder="Ex.: João da Silva Pereira"
              style={inputStyles}
              required
            />
          </Cell>
          <Cell lg={4} md={4} sm={4} xs={12}>
            <Select
              required
              clearable
              style={selectStyles}
              error=""
              itemIsEqual={(a, b) => a.value === b.value}
              itemToString={(item) => (item ? item.label : "")}
              items={[
                {
                  label: "Atendimento",
                  value: 1,
                },
                {
                  label: "Caixa",
                  value: 2,
                },
                {
                  label: "Supervisor",
                  value: 3,
                },
              ]}
              label="Tipo"
              menuMinWidth={undefined}
              name="tipo"
              openOnFocus
              placeholder="Escolha o tipo"
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
          <Cell lg={12} md={12} sm={12} xs={12} style={cellButtonsStyles}>
            <Cell lg={1} md={4} sm={6} xs={12}>
              <Button kind="danger" size="medium" style={buttonStyles}>
                Cancelar
              </Button>
            </Cell>
            <Cell lg={1} md={4} sm={6} xs={12}>
              <Button kind="primary" size="medium" style={buttonStyles}>
                Salvar
              </Button>
            </Cell>
          </Cell>
        </Grid>
      </PageContainer>
    </VFlow>
  );
}
const buttonStyles = css`
  width: 100%;
`;

const cellButtonsStyles = css`
  display: inline-flex;
  justify-content: end;
  padding-right: 0 !important;
  padding-left: 0 !important;
`;

const inputStyles = css`
  width: 100% !important;
  min-height: 38px !important;
  border-color: hsl(0, 0%, 80%) !important;
  border-radius: 4px !important;
  font-size: 1rem;

  input {
    width: 100% !important;
    min-height: 38px !important;
    border-color: hsl(0, 0%, 80%) !important;
    border-radius: 4px !important;
    font-size: 1rem;
  }
`;

const selectStyles = css`
  input {
    min-height: 38px !important;
    border-color: hsl(0, 0%, 80%) !important;
    border-radius: 4px !important;
    font-size: 1rem;
  }

  ul li {
    font-size: 1rem;
  }
`;
