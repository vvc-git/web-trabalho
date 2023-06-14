import { VFlow } from "bold-ui";
import React from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export function SelectItemsOrder() {
  return (
    <VFlow>
      <Select
        options={options}
        placeholder={"Selecione o produto"}
        isClearable
      />
    </VFlow>
  );
}
