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
  VFlow,
} from "bold-ui";
import { css } from "@emotion/react";
import React, { useState } from "react";
import { SelectItemsOrder } from "./SelectItemsOrder";
import { SingleValue } from "react-select";
import { TableOrder } from "./TableOrders";
import { styles } from "bold-ui/lib/components/Dropdown/DropdownMenu";

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

  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Estado para armazenar os elementos selecionados
  const [selectedOption, setSelectedOption] = useState(""); // Estado para armazenar a opção selecionada no <select>

  // Função para adicionar o elemento selecionado à lista
  const addElementToList = () => {
    if (selectedOption !== "" && !selectedItems.includes(selectedOption)) {
      setSelectedItems([...selectedItems, selectedOption]);
      setSelectedOption("");
    }
  };

  // Função para lidar com a alteração da opção selecionada no <select>
  const handleChange = (option: SingleOptionType) => {
    if (option && option.label) {
      setSelectedOption(option.label);
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
            <Grid gap={2} gapVertical={1} style={gridStyles}>
              <Cell xs={10} sm={10} md={10} lg={10} style={cellsStyles}>
                <SelectItemsOrder
                  handleChange={handleChange}
                  //value={selectedOption}
                ></SelectItemsOrder>
              </Cell>
              <Cell xs={2} sm={2} md={2} lg={2}>
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
          </VFlow>
          <TableOrder></TableOrder>
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
`;

const gridStyles = css`
  margin: 0 !important;
  flex-wrap: nowrap !important;
`;

const cellsStyles = css`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;
