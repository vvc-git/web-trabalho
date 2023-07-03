/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, Icons, Select, TextField } from "bold-ui";
import React, { useEffect, useState } from "react";

import { OptionType } from "../view/EditView";
import { UserTypeDB } from "../view/ListUsersView";
import { Field, FieldRenderProps, Form } from "react-final-form";
import { handleApiError, typesEmployees } from "./Helpers";
import { ModalConfirm } from "./ModalConfirm";
import { Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import api from "../api";

interface FormProfileProps {
  user: UserTypeDB | undefined;
  type: OptionType | undefined;
  editUser?: boolean;
  viewUser?: boolean;
  addUser?: boolean;
}

export interface FormValues {
  name: string;
  user: number;
  type: OptionType;
  password: string;
  passwordConfirm: string;
}

export function FormProfile(props: FormProfileProps) {
  const { user, editUser, viewUser, addUser } = props;

  const history = useHistory();

  const typeUser = localStorage.getItem("type");

  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValues | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = (values: FormValues, form: any) => {
    form.change("password", "");
    form.change("passwordConfirm", "");

    setIsModalConfirmOpen(true);
    setFormValues(values);
  };

  useEffect(() => {
    const handleSubmit = async () => {
      if (isSubmitting && formValues) {
        setIsModalConfirmOpen(false);
        setIsSubmitting(false);

        try {
          await api.post("/register", {
            formValues: formValues,
            editUser: editUser || viewUser,
          });

          const message = `Perfil ${
            editUser || viewUser ? "atualizado" : "cadastrado"
          } com sucesso!`;
          setSuccessMessage(message);

          if (editUser || addUser) {
            history.push("/usuarios", { successMessage: message });
          }

          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } catch (error) {
          handleApiError(error, setErrorMessage);
        }
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    };

    if (isSubmitting) {
      handleSubmit();
    }
  }, [
    isSubmitting,
    addUser,
    editUser,
    formValues,
    viewUser,
    history,
    successMessage,
  ]);

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

  const SelectInput = ({
    input,
    meta,
    label,
    placeholder,
    disabled,
  }: FieldRenderProps<any, HTMLElement> & {
    title: string;
    placeholder: string;
    disabled: boolean;
  }) => {
    return (
      <Select
        label={label}
        name={input.name}
        value={input.value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={input.onChange}
        error={meta.touched && meta.error}
        style={selectStyles}
        itemIsEqual={(a, b) => a.value === b.value}
        itemToString={(item) => (item ? item.label : "")}
        items={typesEmployees}
        required
        clearable
      />
    );
  };

  return (
    <>
      <ModalConfirm
        open={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        onChange={() => setIsSubmitting(true)}
        title={`Confirmar ${addUser ? "cadastro" : "atualização"}?`}
        description={`Você confirma ${
          addUser ? "o cadastro" : "a atualização"
        }?`}
      ></ModalConfirm>
      {successMessage && viewUser && (
        <Alert variant="success">{successMessage}</Alert>
      )}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form
        onSubmit={onSubmit}
        initialValues={
          user
            ? {
                name: user.name,
                user: user.user,
                type: user.type,
                password: "",
                passwordConfirm: "",
              }
            : undefined
        }
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid gap={2} gapVertical={1} justifyContent="flex-start">
              <Cell lg={6} md={6} sm={12} xs={12}>
                <Field
                  name="name"
                  type="text"
                  label="Nome completo"
                  placeholder="Ex.: João da Silva"
                  max={30}
                  onIconClick={false}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={4} md={4} sm={12} xs={12}>
                <Field
                  name="user"
                  label="Usuário"
                  placeholder="Digite o CPF do funcionário"
                  disabled={editUser || viewUser}
                  max={11}
                  onIconClick={false}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={2} md={2} sm={12} xs={12}>
                <Field
                  name="type"
                  label="Tipo"
                  placeholder="Tipo do funcionário"
                  onIconClick={false}
                  component={SelectInput}
                  disabled={
                    (editUser && typeUser !== "Supervisor") ||
                    (viewUser && typeUser !== "Supervisor")
                  }
                />
              </Cell>
              <Cell lg={6} md={6} sm={12} xs={12}>
                <Field
                  type="password"
                  name="password"
                  label="Senha"
                  placeholder="Escolha uma senha forte"
                  max={16}
                  icon="zoomOutline"
                  id="clickable"
                  onIconClick={true}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={6} md={6} sm={12} xs={12}>
                <Field
                  type="password"
                  name="passwordConfirm"
                  label="Confirme a senha"
                  placeholder="Digite novamente a senha"
                  max={16}
                  icon="zoomOutline"
                  id="clickable"
                  onIconClick={true}
                  component={TextFieldInput}
                />
              </Cell>
              <Cell lg={12} md={12} sm={12} xs={12} style={cellButtonsStyles}>
                {(addUser || editUser) && (
                  <Cell lg={1} md={4} sm={6} xs={12}>
                    <Button
                      kind="danger"
                      size="medium"
                      style={buttonStyles}
                      onClick={() => history.push("/usuarios")}
                    >
                      Cancelar
                    </Button>
                  </Cell>
                )}
                <Cell lg={1} md={4} sm={6} xs={12}>
                  <Button
                    kind="primary"
                    size="medium"
                    type="submit"
                    style={buttonStyles}
                  >
                    Salvar
                  </Button>
                </Cell>
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

  span {
    right: 1px !important;
    border: 2px solid red !important;
    background-color: grey !important;
    color: white !important;
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
