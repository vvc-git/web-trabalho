/** @jsxImportSource @emotion/react */
import {
  Button,
  Cell,
  Grid,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  VFlow,
} from "bold-ui";
import { css } from "@emotion/react";
import React, { useState } from "react";
import { SelectItemsOrder } from "./SelectItemsOrder";
import { SingleValue } from "react-select";
import { TableOrder } from "./TableOrders";
import NumericInput from "react-numeric-input";

interface ModalOrderProps {
  open: boolean;
  onClose(): void;
  tableNumer: string;
}

interface OptionType {
  value: string;
  label: string;
}

export type SingleOptionType = SingleValue<OptionType>;

export function ModalOrder(props: ModalOrderProps) {
  const { open, onClose, tableNumer } = props;

  const [selectedItems, setSelectedItems] = useState<SingleOptionType[]>([]); // Estado para armazenar os elementos selecionados
  const [selectedOption, setSelectedOption] = useState<SingleOptionType | null>(
    null
  ); // Estado para armazenar a opção selecionada no <select>

  // Função para adicionar o elemento selecionado à lista
  const addElementToList = () => {
    if (
      selectedOption &&
      selectedOption.label &&
      !selectedItems.some((item) => item!.value === selectedOption.value)
    ) {
      setSelectedItems([...selectedItems, selectedOption]);
      setSelectedOption(null);
    }
  };

  // Função para lidar com a alteração da opção selecionada no <select>
  const handleChange = (option: SingleOptionType) => {
    if (option && option.label) {
      setSelectedOption(option);
    }
  };

  return (
    <>
      <Modal size="large" onClose={onClose} open={open}>
        <ModalBody>
          <VFlow>
            <HFlow alignItems="center">
              <Icon
                icon="cutleryFilled"
                style={{ marginRight: "0.5rem" }}
                size={3}
                fill="info"
              />
              <Heading level={1}>Pedido da Mesa {tableNumer}</Heading>
            </HFlow>
            <Grid gap={2} gapVertical={1} alignItems="flex-end">
              <Cell xs={12} sm={12} md={7} lg={7}>
                <SelectItemsOrder
                  handleChange={handleChange}
                ></SelectItemsOrder>
              </Cell>
              <Cell xs={6} sm={6} md={3} lg={3}>
                <NumericInput
                  css={numericInputStyles}
                  placeholder="Quantidade"
                  min={1}
                  max={10}
                ></NumericInput>
              </Cell>
              <Cell xs={6} sm={6} md={2} lg={2}>
                <Button
                  size="medium"
                  skin="default"
                  kind="primary"
                  style={buttonAdicionarStyles}
                  onClick={addElementToList}
                >
                  Adicionar
                </Button>
              </Cell>
            </Grid>
            <TableOrder items={selectedItems}></TableOrder>
            <Text style={totalStyles}>Total: R$</Text>
          </VFlow>
        </ModalBody>
        <ModalFooter>
          <HFlow justifyContent="flex-end">
            <Button onClick={onClose}>Sair</Button>
            <Button kind="primary" onClick={onClose}>
              Concluir
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
    </>
  );
}

const buttonAdicionarStyles = css`
  padding: calc(0.4rem - 1px) 1rem !important;
  width: 100%;
`;

const numericInputStyles = css`
  width: 100%;
  min-height: 38px;
  border-color: hsl(0, 0%, 80%) !important;
  border-radius: 4px !important;
  padding-left: 8px !important;

  &:focus {
    border-color: #2684ff !important;
    box-shadow: 0 0 0 1px #2684ff !important;
  }
`;

const totalStyles = css`
  color: #e60000;
  font-weight: bold;
  font-size: 1.25rem;
`;
