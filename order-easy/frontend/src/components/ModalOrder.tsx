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
import React, { useEffect, useState } from "react";
import { SelectItemsOrder } from "./SelectItemsOrder";
import { SingleValue } from "react-select";
import { TableOrder } from "./TableOrders";
import NumericInput from "react-numeric-input";
import { Total } from "./Total";
import { formatNumberWithTwoDigits, produtos } from "./Helpers";
import uuid from "react-uuid";
import axios from "axios";

interface ModalOrderProps {
  open: boolean;
  onClose(): void;
  tableNumer: number;
}

export interface ProductSaveType {
  id: string;
  order: string;
  amount: number;
  price: number;
  desk: number;
}

interface ProductQueryType {
  id: string;
  item: string;
  price: number;
}

interface ProductSelectType {
  value: string;
  label: string;
}

export type SingleOptionType = SingleValue<ProductSelectType>;

export function ModalOrder(props: ModalOrderProps) {
  const { open, onClose, tableNumer } = props;

  const [amountValue, setAmountValue] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<ProductSaveType[]>([]);
  const [selectedOption, setSelectedOption] = useState<SingleOptionType | null>(
    null
  );

  const ordersTable = selectedItems.filter((item) => item.desk === tableNumer);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await axios.post(
          "http://localhost:4000/queryOrdersByDesk",
          {
            numberDesk: tableNumer,
          }
        );
        setSelectedItems(orders.data);
      } catch {}
    };

    fetchData(); // Chama a função fetchData ao montar o componente
  }, [open, onClose]);

  useEffect(() => {
    const total = selectedItems
      .filter((produto) => produto.desk === tableNumer)
      .map((produto) => produto.price * produto.amount)
      .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

    setTotal(total);
  }, [selectedItems, tableNumer, setTotal]);

  function convertSingleOptionTypeToProduct(
    singleOptionType: SingleOptionType,
    amountValue: number
  ): ProductSaveType {
    const id: string = uuid();
    const item: string = singleOptionType?.label ? singleOptionType.label : "";
    const amount: number = amountValue ? amountValue : 0;
    const productFind: ProductQueryType | undefined = produtos.find(
      (product) => {
        return product.id === singleOptionType!.value;
      }
    );

    if (productFind) {
      const price: number = productFind.price;

      const convertedProduct: ProductSaveType = {
        id: productFind.id,
        order: item,
        amount: amount,
        price: price,
        desk: tableNumer,
      };

      return convertedProduct;
    }

    throw new Error(`Produto de ID ${id} não foi encontrado.`);
  }

  const handleNumericChange = (valueAsNumber: number | null) => {
    setAmountValue(valueAsNumber);
  };

  const addElementToList = () => {
    if (amountValue !== null && amountValue !== 0 && selectedOption !== null) {
      const element: ProductSaveType = convertSingleOptionTypeToProduct(
        selectedOption,
        amountValue
      );
      setSelectedItems([...selectedItems, element]);
      setTotal(Number((total + element.price * element.amount).toFixed(2)));
      setSelectedOption(null);
      setAmountValue(0);
    }
  };

  const handleSelectChange = (option: SingleOptionType) => {
    if (option && option.label) {
      setSelectedOption(option);
    }
  };

  const handleButtonSaveClick = async () => {
    try {
      await axios.post("http://localhost:4000/registerOrder", {
        pedidos: ordersTable,
        desk: tableNumer,
      });
      onClose();
    } catch (error) {}
  };

  return (
    <>
      <Modal
        size="large"
        onClose={onClose}
        open={open}
        style={modalStyles}
        closeOnBackdropClick={false}
      >
        <ModalBody>
          <VFlow>
            <HFlow alignItems="center">
              <Icon
                icon="cutleryFilled"
                style={{ marginRight: "0.5rem" }}
                size={3}
                fill="info"
              />
              <Heading level={1}>
                Mesa {formatNumberWithTwoDigits(tableNumer)}
              </Heading>
            </HFlow>
            <Grid gap={2} gapVertical={1} alignItems="flex-end">
              <Cell xs={12} sm={12} md={7} lg={7}>
                <SelectItemsOrder
                  handleChange={handleSelectChange}
                  value={selectedOption}
                ></SelectItemsOrder>
              </Cell>
              <Cell
                xs={12}
                sm={10}
                md={3}
                lg={3}
                style={cellNumericInputStyles}
              >
                <NumericInput
                  css={numericInputStyles}
                  placeholder="Quantidade"
                  min={0}
                  max={10}
                  value={amountValue !== null ? amountValue : 0}
                  onChange={handleNumericChange}
                  required
                ></NumericInput>
              </Cell>
              <Cell xs={12} sm={2} md={2} lg={2}>
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
              <Cell xs={12} sm={12} md={12} lg={12}>
                <div css={divTableStyles}>
                  <TableOrder
                    items={ordersTable}
                    onChangeItems={setSelectedItems}
                  ></TableOrder>
                </div>
              </Cell>
              <Cell xs={12} sm={12} md={12} lg={12}>
                <Total value={total}></Total>
              </Cell>
            </Grid>
          </VFlow>
        </ModalBody>
        <ModalFooter>
          <HFlow justifyContent="flex-end">
            <Button onClick={onClose} kind="danger">
              Cancelar
            </Button>
            <Button kind="primary" onClick={handleButtonSaveClick}>
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

  span {
    width: 100%;
  }
`;

const cellNumericInputStyles = css`
  span {
    width: 100%;
  }
`;

const divTableStyles = css`
  overflow: auto;
  border: 1px solid #d3d4dd;
  border-radius: 0.375rem !important;
  border-bottom: none;
`;

const modalStyles = css`
  @media (max-width: 767px) {
    min-width: 100% !important;
  }
`;
