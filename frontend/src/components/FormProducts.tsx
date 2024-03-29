/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Button, Cell, Grid, TextField } from "bold-ui";
import { Field, FieldRenderProps, Form } from "react-final-form";
import api from "../api";
import { v4 as uuidv4 } from "uuid";
import { NumericFormat } from "react-number-format";
import { FormApi } from "final-form";

// interface das props do componente
interface FormProductsProps {
  update(): void;
}

// interface do tipo de objeto de um produto
interface FormProductsValues {
  label: string;
  price: string;
}

// Componente do formulário dos produtos
export function FormProducts(props: FormProductsProps) {
  const { update } = props;

  // Função para lidar com o envio do formulário
  const onSubmit = async (
    product: FormProductsValues,
    form: FormApi<FormProductsValues>
  ) => {
    // Formatação do preço para remover virgula e trocar por . e remover o ponto de separação de milhar
    const formattedPrice = Number(
      product.price.substring(2).replace(/\./g, "").replace(",", ".")
    );

    const value = uuidv4();
    try {
      // Requisição para adicionar o produto
      await api.post("/addProduct", {
        product: {
          value: value,
          label: product.label,
          price: formattedPrice,
        },
      });
      form.reset();
      update();
    } catch {}
  };

  // Componente customizado para o campo de input de texto
  const TextFieldInput = ({
    input,
    meta,
    label,
    placeholder,
    max,
  }: FieldRenderProps<any, HTMLElement> & {
    title: string;
    placeholder: string;
    max: number;
  }) => {
    // retorna o input de descrição do produto
    return (
      <TextField
        type={input.type}
        label={label}
        name={input.name}
        value={input.value}
        placeholder={placeholder}
        onChange={input.onChange}
        error={meta.touched && meta.error}
        style={inputStyles}
        maxLength={max}
        clearable
        required
      />
    );
  };

  // Componente customizado para o campo de input numérico
  const NumberInput = ({
    input,
    label,
    placeholder,
    required,
    max,
  }: FieldRenderProps<any, HTMLElement> & {
    title: string;
    placeholder: string;
    max: number;
  }) => (
    <>
      <div css={stylesDivRequired}>
        <label>{label}</label>
        {required && <span css={stylesSpanRequired}>*</span>}
      </div>
      {/*Componente para inserir preço */}
      <NumericFormat
        name={input.name}
        value={input.value}
        placeholder={placeholder}
        displayType="input"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        prefix="R$"
        max={max}
        onChange={(values) => {
          input.onChange(values);
        }}
        css={stylesNumericFormat}
        required
      />
    </>
  );

  // retorna o formulário
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Grid gap={2} gapVertical={1} alignItems="flex-end">
            <Cell lg={7} md={6} sm={12} xs={12}>
              {/* Componente Field para o campo de descrição do produto */}
              <Field
                name="label"
                type="text"
                label="Produto"
                placeholder="Descrição do produto"
                max={50}
                component={TextFieldInput}
              />
            </Cell>
            <Cell lg={3} md={3} sm={8} xs={12}>
              {/* Componente Field para o campo de preço */}
              <Field
                name="price"
                label="Preço"
                placeholder="R$00,00"
                required
                max={8}
                component={NumberInput}
              />
            </Cell>
            <Cell lg={2} md={3} sm={4} xs={12}>
              {/* Botão de adicionar */}
              <Button
                type="submit"
                kind="primary"
                size="medium"
                style={buttonStyles}
              >
                Adicionar
              </Button>
            </Cell>
          </Grid>
        </form>
      )}
    />
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

const stylesSpanRequired = css`
  color: #d01e29;
  margin-left: 0.25rem;
`;

const stylesDivRequired = css`
  display: flex;
  align-items: center;
  font-weight: bold;
  display: block;
  margin-bottom: 0.25rem;
  line-height: 20px;
`;

const stylesNumericFormat = css`
  width: 100%;
  min-height: 38px;
  border-color: hsl(0, 0%, 80%) !important;
  border-radius: 4px !important;
  padding-left: 8px !important;
  border: solid 1px;

  &:focus {
    border-color: #2684ff !important;
    box-shadow: 0 0 0 1px #2684ff !important;
  }
`;
