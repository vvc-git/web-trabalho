/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from "react";
import { css } from "@emotion/react";
import { Button, Cell, Grid, Icons, TextField } from "bold-ui";
import { Field, FieldRenderProps, Form } from "react-final-form";
import { FormValues } from "./FormProfile";
import { handleApiError } from "./Helpers";
import { Alert } from "react-bootstrap";
import { Context } from "../context/AuthProvider";

export function FormLogin() {
  const { handleLogin } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (values: FormValues) => {
    try {
      await handleLogin(values);
    } catch (error) {
      handleApiError(error, setErrorMessage);
    }
  };

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
    const [showPassword, setShowPassword] = useState(false);

    const handleIconClick = () => {
      onIconClick && setShowPassword(!showPassword);
    };

    const inputType = showPassword ? "text" : "password";

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
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid gap={2} gapVertical={1} justifyContent="flex-start">
              <Cell lg={12} md={12} sm={12} xs={12}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
                <Button
                  type="submit"
                  kind="primary"
                  size="medium"
                  style={buttonStyles}
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
