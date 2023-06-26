/** @jsxImportSource @emotion/react */
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import { css } from "@emotion/react";
import React, { Dispatch, SetStateAction } from "react";
import { ProductList } from "./ModalOrder";

interface TableOrderProps {
  items: ProductList[];
  onChangeItems: Dispatch<SetStateAction<ProductList[]>>;
  tableNumer: number;
}

interface ItemType {
  id: string;
  order: string;
  amount: number;
  price: number;
}

export function TableOrder(props: TableOrderProps) {
  const { items, onChangeItems, tableNumer } = props;

  const ordersTable = items.filter((item) => item.desk === tableNumer);

  const handleDeleteItem = (itemId: string) => {
    onChangeItems(items.filter((item) => item.id !== itemId));
  };

  const renderOrder = (item: ItemType) => {
    return item.order;
  };

  const renderAmount = (item: ItemType) => {
    return item.amount;
  };

  const renderPrice = (item: ItemType) => {
    return (item.price * item.amount).toFixed(2);
  };

  const renderButton = (item: ItemType) => {
    return (
      <Tooltip text="Excluir">
        <Button
          size="small"
          skin="ghost"
          onClick={() => handleDeleteItem(item.id)}
        >
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
      rows={ordersTable}
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
