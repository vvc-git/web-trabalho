import { VFlow } from "bold-ui";
import React from "react";
import Select from "react-select";
import { SingleOptionType } from "./ModalOrder";
import { produtos } from "./Helpers";

interface SelectItemsOrderProps {
  handleChange(option: SingleOptionType): void;
  value: SingleOptionType;
}

interface Product {
  id: string;
  item: string;
  price: number;
}

interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = convertProductsToOptionTypes(produtos);

function convertProductsToOptionTypes(products: Product[]): OptionType[] {
  return products.map(convertProductToOptionType);
}

function convertProductToOptionType(product: Product): OptionType {
  const optionType: OptionType = {
    value: product.id.toString(),
    label: `${product.item} - R$${product.price.toFixed(2)}`,
  };

  return optionType;
}

export function SelectItemsOrder(props: SelectItemsOrderProps) {
  const { handleChange, value } = props;

  return (
    <VFlow>
      <Select
        onChange={handleChange}
        options={options}
        placeholder={"Selecione o produto"}
        value={value}
        required
      />
    </VFlow>
  );
}
