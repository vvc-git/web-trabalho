/** @jsxImportSource @emotion/react */
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import { css } from "@emotion/react";
import React from "react";
import { SingleOptionType } from "./ModalOrder";

interface TableOrderProps {
  items: SingleOptionType[];
}
interface ItemType {
  id: number;
  order: string;
  amount: number;
  price: number;
}

export function TableOrder(props: TableOrderProps) {
  const { items } = props;

  const options = [
    {
      id: 1,
      order: "Coca Cola",
      amount: 2,
      price: 20.0,
    },
    {
      id: 2,
      order: "Sopa",
      amount: 1,
      price: 20.0,
    },
    {
      id: 3,
      order: "Bolachinha",
      amount: 5,
      price: 20.0,
    },
    {
      id: 2,
      order: "Sopa",
      amount: 1,
      price: 20.0,
    },
    {
      id: 3,
      order: "Bolachinha",
      amount: 5,
      price: 20.0,
    },
    {
      id: 1,
      order: "Coca Cola",
      amount: 2,
      price: 20.0,
    },
    {
      id: 2,
      order: "Sopa",
      amount: 1,
      price: 20.0,
    },
    {
      id: 3,
      order: "Bolachinha",
      amount: 5,
      price: 20.0,
    },
    {
      id: 2,
      order: "Sopa",
      amount: 1,
      price: 20.0,
    },
    {
      id: 3,
      order: "Bolachinha",
      amount: 5,
      price: 20.0,
    },
  ];

  const renderId = (row: ItemType) => {
    return row.id;
  };

  const renderOrder = (row: ItemType) => {
    return row.order;
  };

  const renderAmount = (row: ItemType) => {
    return row.amount;
  };

  const renderPrice = (row: ItemType) => {
    return row.price;
  };

  const renderButton = () => {
    return (
      <Tooltip text="Excluir">
        <Button size="small" skin="ghost" onClick={() => {}}>
          <Icon icon="trashOutline" style={trachIconStyles} />
        </Button>
      </Tooltip>
    );
  };

  return (
    <DataTable<ItemType>
      style={tableOrderStyles}
      columns={[
        {
          header: "Item",
          name: "id",
          render: renderId,
          sortable: true,
        },
        {
          header: "Pedido",
          name: "order",
          render: renderOrder,
          sortable: true,
        },
        {
          header: "Quantidade",
          name: "amount",
          render: renderAmount,
          sortable: true,
        },
        {
          header: "R$",
          name: "price",
          render: renderPrice,
          sortable: true,
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
      rows={options}
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

  thead tr th svg {
    font-size: 0;
  }
`;

const trachIconStyles = css`
  color: rgb(208, 30, 41) !important;
`;
