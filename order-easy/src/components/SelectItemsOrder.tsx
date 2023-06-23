import { Input, VFlow } from "bold-ui";
import React from "react";
import Select from "react-select";
import { SingleOptionType } from "./ModalOrder";

interface SelectItemsOrderProps {
  handleChange(option: SingleOptionType): void;
}

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "sopa", label: "Sopa" },
  { value: "bolachinha", label: "Bolachinha" },
];

export function SelectItemsOrder(props: SelectItemsOrderProps) {
  const { handleChange } = props;

  return (
    <VFlow>
      <Select
        onChange={handleChange}
        options={options}
        placeholder={"Selecione o produto"}
        isClearable
      />
    </VFlow>
  );
}
