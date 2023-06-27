/** @jsxImportSource @emotion/react */
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import { css } from "@emotion/react";
import React, { Dispatch, SetStateAction } from "react";
import { ProductSaveType } from "./ModalOrder";

interface TableOrderProps {
  items: ProductSaveType[];
  onChangeItems: Dispatch<SetStateAction<ProductSaveType[]>>;
}

interface ProductListType {
  id: string;
  order: string;
  amount: number;
  price: number;
}

export function TableOrder(props: TableOrderProps) {
  const { items, onChangeItems } = props;

  const handleDeleteItem = (itemId: string) => {
    onChangeItems(items.filter((item) => item.id !== itemId));
  };

  const renderOrder = (product: ProductListType) => {
    return product.order;
  };

  const renderAmount = (product: ProductListType) => {
    return product.amount;
  };

  const renderPrice = (product: ProductListType) => {
    return (product.price * product.amount).toFixed(2);
  };

  const renderButton = (product: ProductListType) => {
    return (
      <Tooltip text="Excluir">
        <Button
          size="small"
          skin="ghost"
          onClick={() => handleDeleteItem(product.id)}
        >
          <Icon icon="trashOutline" style={trachIconStyles} />
        </Button>
      </Tooltip>
    );
  };

  return (
    <DataTable<ProductListType>
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
