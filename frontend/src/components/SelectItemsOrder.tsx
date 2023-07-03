import { VFlow } from "bold-ui";
import React from "react";
import Select, { SingleValue } from "react-select";
import { ItemSelectedType, ProductType } from "./ModalOrder";

// Interface dos objetos das props do componente
interface SelectItemsOrderProps {
  handleChange(option: SingleValue<ItemSelectedType>): void;
  value: ItemSelectedType;
  products: ProductType[];
}

// Componente de seleção dos produtos para pedido
export function SelectItemsOrder(props: SelectItemsOrderProps) {
  const { handleChange, value, products } = props;

  // Converte a lista de produtos em uma lista de opções válidas para o componente Select
  const options: ItemSelectedType[] = convertToSelect(products);

  // Função usada na conversão de tipos
  function convertToSelect(products: ProductType[]): ItemSelectedType[] {
    return products.map((product) => {
      const { value, label } = product;
      const formattedPrice = `R$${product.price.toFixed(2)}`;
      const updatedLabel = `${label} - ${formattedPrice}`;
      return { value, label: updatedLabel };
    });
  }

  // Retorna o select
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
