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

// Definição das props do componente ModalOrder
interface ModalOrderProps {
  open: boolean;
  onClose(): void;
  tableNumber: number;
}

// Definição do tipo ProductType
export interface ProductType {
  value: string;
  label: string;
  price: number;
}

// Definição do tipo OrderType
export interface OrderType {
  idOrder: string;
  value: string;
  label: string;
  price: number;
  amount: number;
  table: number;
}

// Definição do tipo ItemSelectedType
export interface ItemSelectedType {
  value: string;
  label: string;
}

// Definição de um tipo vazio
const emptyProduct = {
  value: "",
  label: "",
};

// Componente do modal para fazer pedidos da mesa
export function ModalOrder(props: ModalOrderProps) {
  const { open, onClose, tableNumber } = props;

  // States que armazena os pedidos da mesa
  const [ordersTable, setOrdersTable] = useState<OrderType[]>([]);

  // States que armazena o item selecionado
  const [selectedOption, setSelectedOption] =
    useState<ItemSelectedType>(emptyProduct);

  // States que armazena a quantidade de itens daquele pedido
  const [amountValue, setAmountValue] = useState<number>(0);

  // States que armazena o valor total do pedido da mesa
  const [total, setTotal] = useState<number>(0);

  // States que indica se o pedido foi alterado
  const [orderModified, setOrderModified] = useState(false);

  // States que armazena os produtos do estabelecimento
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    // Função para buscar todos os produtos
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
    // Função para buscar os pedidos da mesa selecionada
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

  // Seta a quantidade de itens do pedido
  const handleNumericChange = (valueAsNumber: number | null) => {
    setAmountValue(valueAsNumber ? valueAsNumber : 0);
  };

  // Função para adicionar um elemento à lista de pedidos
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

  // Função para lidar com a mudança na seleção do item
  const handleSelectChange = (option: ItemSelectedType) => {
    if (option) {
      setSelectedOption(option);
    }
  };

  // Renderização do componente ModalOrder
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
              {/* Título com o número da mesa */}
              <Heading level={1}>
                Mesa {formatNumberWithTwoDigits(tableNumber)}
              </Heading>
            </HFlow>
            {/* Formulário de seleção de itens e quantidade */}
            <Grid gap={2} gapVertical={1} alignItems="flex-end">
              <Cell xs={12} sm={12} md={7} lg={7}>
                {/* Input de seleção do produto */}
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
                {/* Input de quantidade de itens do produto */}
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
                {/* Botão para adicionar o pedido */}
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
                  {/* Tabela de pedidos */}
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

// Estilos CSS para o botão "Adicionar"
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
