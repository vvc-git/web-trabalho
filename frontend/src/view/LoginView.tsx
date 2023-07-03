/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { Cell, Grid, Heading, Link, VFlow } from "bold-ui";
import { FormLogin } from "../components/FormLogin";
import { ModalForgetPassword } from "../components/ModalForgetPassword";

// Importa o padrão branco de imagem
const whitePattern = require("../img/padrao-branco.svg").default;

// Componente de visualização de login
export function LoginView() {
  // State para controlar a abertura/fechamento do modal de recuperação de senha
  const [isModalForgetPassword, setIsModalForgetPassword] = useState(false);

  return (
    <div css={fragmentStyles}>
      {/* Modal de recuperação de senha */}
      <ModalForgetPassword
        open={isModalForgetPassword}
        onClose={() => setIsModalForgetPassword(false)}
      ></ModalForgetPassword>
      <Grid
        alignItems="center"
        direction="row"
        gap={2}
        gapVertical={1}
        justifyContent="center"
        style={gridStyles}
        wrap
      >
        <Cell lg={3} md={5} sm={7} xs={12} style={containerLoginStyles}>
          <VFlow vSpacing={1}>
            {/* Título do login */}
            <Heading color="normal" level={1}>
              Entre com seus dados
            </Heading>

            {/* Componente de formulário de login */}
            <FormLogin></FormLogin>

            <Cell lg={12} md={12} sm={12} xs={12} style={senhaStyles}>
              {/* Link para abrir o modal de recuperação de senha */}
              <Link onClick={() => setIsModalForgetPassword(true)}>
                Esqueci minha senha
              </Link>
            </Cell>
          </VFlow>
        </Cell>
      </Grid>
    </div>
  );
}

// Estilos CSS utilizando a biblioteca emotion
const fragmentStyles = css`
  background-color: #0069d0;
  background-image: url(${whitePattern});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const gridStyles = css`
  width: 100%;
  padding: 1rem;
  margin: 0 !important;
`;

const containerLoginStyles = css`
  padding: 4rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`;

const senhaStyles = css`
  padding-left: 0 !important;
`;
