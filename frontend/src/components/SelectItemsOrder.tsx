import { VFlow } from "bold-ui";
import React from "react";
import Select, { SingleValue } from "react-select";
import { ItemSelectedType, ProductType } from "./ModalOrder";

interface SelectItemsOrderProps {
  handleChange(option: SingleValue<ItemSelectedType>): void;
  value: ItemSelectedType;
  products: ProductType[];
}

export function SelectItemsOrder(props: SelectItemsOrderProps) {
  const { handleChange, value, products } = props;

  const options: ItemSelectedType[] = convertToSelect(products);

  function convertToSelect(products: ProductType[]): ItemSelectedType[] {
    return products.map((product) => {
      const { value, label } = product;
      const formattedPrice = `R$${product.price.toFixed(2)}`;
      const updatedLabel = `${label} - ${formattedPrice}`;
      return { value, label: updatedLabel };
    });
  }

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
