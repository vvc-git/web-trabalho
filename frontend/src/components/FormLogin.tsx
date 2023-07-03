/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from "react";
import { css } from "@emotion/react";
import { Button, Cell, Grid, Icons, TextField } from "bold-ui";
import { Field, FieldRenderProps, Form } from "react-final-form";
import { FormValues } from "./FormProfile";
import { handleApiError } from "./Helpers";
import { Alert } from "react-bootstrap";
import { Context } from "../context/AuthProvider";

// Componente do formulário de login
export function FormLogin() {
  const { handleLogin } = useContext(Context);
  // State que seta o erro de login
  const [errorMessage, setErrorMessage] = useState("");

  // State que indica se o login está sendo feito ou não (aguardando ou não resposta do servidor)
  const [login, setLogin] = useState(false);

  // Função para lidar com o envio do formulário
  const onSubmit = async (values: FormValues) => {
    setLogin(true);
    try {
      await handleLogin(values);
    } catch (error) {
      handleApiError(error, setErrorMessage);
    }
    setLogin(false);
  };

  // Componente customizado para o campo de input do formulário
  const TextFieldInput = ({
    input,
    meta,
    label,
    placeholder,
    disabled,
    max,
    icon,
    id,
    onIconClick,
  }: FieldRenderProps<any, HTMLElement> & {
    title: string;
    placeholder: string;
    disabled: boolean;
    max: number;
    icon: Icons | undefined;
    id: string | undefined;
    onIconClick: boolean;
  }) => {
    // State para manter a informação se mostra ou não a senha ao clicar no botão de lupa
    const [showPassword, setShowPassword] = useState(false);

    // Manipulador de evento para mostrar ou esconder a senha
    const handleIconClick = () => {
      onIconClick && setShowPassword(!showPassword);
    };

    // Define o tipo de botão dependendo do valor de showPassword
    const inputType = showPassword ? "text" : "password";

    // retorna o componente de input
    return (
      <TextField
        icon={icon}
        id={id}
        type={onIconClick ? inputType : input.type}
        label={label}
        name={input.name}
        value={input.value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={input.onChange}
        error={meta.touched && meta.error}
        style={inputStyles}
        maxLength={max}
        onIconClick={handleIconClick}
        clearable
        required
      />
    );
  };

  return (
    <>
      {/* Componente do formulário de login */}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid gap={2} gapVertical={1} justifyContent="flex-start">
              <Cell lg={12} md={12} sm={12} xs={12}>
                {/* Exibe a mensagem de erro ao logar */}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {/* Input para inserir usuário */}
                <Field
                  name="user"
                  label="Usuário"
                  placeholder="Digite o seu usuário"
                  max={11}
                  onIconClick={false}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={12} md={12} sm={12} xs={12}>
                {/* Input para inserir senha */}
                <Field
                  type="password"
                  name="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  max={16}
                  icon="zoomOutline"
                  id="clickable"
                  onIconClick={true}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={12} md={12} sm={12} xs={12}>
                {/* Botão de envio */}
                <Button
                  type="submit"
                  kind="primary"
                  size="medium"
                  style={buttonStyles}
                  loading={login}
                >
                  Entrar
                </Button>
              </Cell>
            </Grid>
          </form>
        )}
      />
    </>
  );
}

// Estilos CSS utilizando a biblioteca emotion
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
