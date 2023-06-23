import { VFlow } from "bold-ui";
import React from "react";
import Select from "react-select";
import { SingleOptionType } from "./ModalOrder";

interface SelectItemsOrderProps {
  handleChange(option: SingleOptionType): void;
  //selectedOption: string;
}

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export function SelectItemsOrder(props: SelectItemsOrderProps) {
  const { handleChange } = props;

  return (
    <VFlow>
      <Select
        onChange={handleChange}
        options={options}
        placeholder={"Selecione o produto"}
        //value={selectedOption}
        isClearable
      />
    </VFlow>
  );
}
