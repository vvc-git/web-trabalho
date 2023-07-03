/** @jsxImportSource @emotion/react */
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import { css } from "@emotion/react";
import React from "react";
import { OrderType } from "./ModalOrder";
import api from "../api";

interface TableOrderProps {
  items: OrderType[];
  setOrderModified(value: boolean): void;
}

export function TableOrder(props: TableOrderProps) {
  const { items, setOrderModified } = props;

  const handleDeleteItem = async (idOrder: string) => {
    try {
      await api.post("/removeOrder", {
        idOrder: idOrder,
      });
      setOrderModified(true);
    } catch {}
  };

  const renderOrder = (product: OrderType) => {
    return product.label;
  };

  const renderAmount = (product: OrderType) => {
    return product.amount;
  };

  const renderPrice = (product: OrderType) => {
    return (product.price * product.amount).toFixed(2);
  };

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
