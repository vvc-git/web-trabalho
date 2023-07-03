/** @jsxImportSource @emotion/react */
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import { css } from "@emotion/react";
import React from "react";
import { OrderType } from "./ModalOrder";
import api from "../api";

// Props do componente TableOrder
interface TableOrderProps {
  items: OrderType[];
  setOrderModified(value: boolean): void;
}

// Componente TableOrder
export function TableOrder(props: TableOrderProps) {
  const { items, setOrderModified } = props;

  // Função para lidar com a exclusão de um item
  const handleDeleteItem = async (idOrder: string) => {
    try {
      await api.post("/removeOrder", {
        idOrder: idOrder,
      });
      setOrderModified(true);
    } catch {}
  };

  // Função para renderizar o nome do pedido
  const renderOrder = (product: OrderType) => {
    return product.label;
  };

  // Função para renderizar a quantidade do pedido
  const renderAmount = (product: OrderType) => {
    return product.amount;
  };

  // Função para renderizar o preço total do pedido
  const renderPrice = (product: OrderType) => {
    return (product.price * product.amount).toFixed(2);
  };

  // Função para renderizar o botão de exclusão do pedido
  const renderButton = (product: OrderType) => {
    return (
      <Tooltip text="Excluir">
        <Button
          size="small"
          skin="ghost"
          onClick={() => handleDeleteItem(product.idOrder)}
        >
          <Icon icon="trashOutline" style={trachIconStyles} />
        </Button>
      </Tooltip>
    );
  };

  // Renderização do componente DataTable que exibe a tabela de pedidos
  return (
    <DataTable<OrderType>
      style={tableOrderStyles}
      columns={[
        {
          header: "Pedido",
          name: "order",
          render: renderOrder,
        },
        {
          header: "Quantidade",
          name: "amount",
          render: renderAmount,
        },
        {
          header: "R$",
          name: "price",
          render: renderPrice,
        },
        {
          name: "buttons",
          render: renderButton,
          style: {
            textAlign: "right",
          },
        },
      ]}
      hovered
      rows={items}
    />
  );
}

// Estilos CSS para a tabela de pedidos
const tableOrderStyles = css`
  font-size: 0.9rem !important;
  border: none;

  thead {
    background-color: #0069d0;
    color: white;
    height: 3.25rem;
  }

  thead span {
    cursor: auto;
  }
`;

const trachIconStyles = css`
  color: rgb(208, 30, 41) !important;
`;
