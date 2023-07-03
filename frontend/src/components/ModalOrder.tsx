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
import { TableOrder } from "./TableOrders";
import NumericInput from "react-numeric-input";
import { Total } from "./Total";
import { formatNumberWithTwoDigits } from "./Helpers";
import api from "../api";
import { v4 as uuidv4 } from "uuid";

interface ModalOrderProps {
  open: boolean;
  onClose(): void;
  tableNumber: number;
}

export interface ProductType {
  value: string;
  label: string;
  price: number;
}

export interface OrderType {
  idOrder: string;
  value: string;
  label: string;
  price: number;
  amount: number;
  table: number;
}

export interface ItemSelectedType {
  value: string;
  label: string;
}

const emptyProduct = {
  value: "",
  label: "",
};

export function ModalOrder(props: ModalOrderProps) {
  const { open, onClose, tableNumber } = props;

  const [ordersTable, setOrdersTable] = useState<OrderType[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<ItemSelectedType>(emptyProduct);
  const [amountValue, setAmountValue] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [orderModified, setOrderModified] = useState(false);

  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const executeQueryAllProducts = async () => {
      try {
        const response = await api.get("/queryAllProducts");
        const allProducts = response.data;
        setProducts(allProducts);
      } catch {}
    };
    executeQueryAllProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await api.post("/queryOrdersByTable", {
          tableNumber: tableNumber,
        });
        const totalOrders = orders.data.reduce(
          (total: number, product: OrderType) => {
            const { amount, price } = product;
            return total + amount * price;
          },
          0
        );
        setTotal(totalOrders);
        setOrdersTable(orders.data);
      } catch {}
    };
    fetchData();
    setOrderModified(false);
  }, [open, onClose, tableNumber, orderModified, setOrderModified]);

  const handleNumericChange = (valueAsNumber: number | null) => {
    setAmountValue(valueAsNumber ? valueAsNumber : 0);
  };

  const addElementToList = async () => {
    if (amountValue !== null && amountValue !== 0 && selectedOption !== null) {
      const product: ProductType | undefined = products!.find(
        (item) => item.value === selectedOption.value
      );

      if (product) {
        const order: OrderType = {
          idOrder: uuidv4(),
          value: product.value,
          label: product.label,
          price: product.price,
          amount: amountValue,
          table: tableNumber,
        };

        try {
          await api.post("/registerOrder", {
            order: order,
          });
        } catch {}
        setSelectedOption(emptyProduct);
        setOrderModified(true);
        setAmountValue(0);
      }
    }
  };

  const handleSelectChange = (option: ItemSelectedType) => {
    if (option) {
      setSelectedOption(option);
    }
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
                Mesa {formatNumberWithTwoDigits(tableNumber)}
              </Heading>
            </HFlow>
            <Grid gap={2} gapVertical={1} alignItems="flex-end">
              <Cell xs={12} sm={12} md={7} lg={7}>
                <SelectItemsOrder
                  handleChange={handleSelectChange}
                  products={products}
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
                    setOrderModified={setOrderModified}
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
            <Button kind="normal" onClick={onClose}>
              Fechar
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
