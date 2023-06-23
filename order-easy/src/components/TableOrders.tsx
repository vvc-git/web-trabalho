import { PagedTable, Text } from "bold-ui";
import React from "react";

interface ItemType {
  id: number;
  name: string;
  age: number;
}

export function TableOrder() {
  const options = [
    {
      age: 42,
      id: 1,
      name: "MARIA MACHADO DE JESUS",
    },
    {
      age: 34,
      id: 2,
      name: "JOSÉ DA SILVA MOREIRA",
    },
    {
      age: 27,
      id: 3,
      name: "ALICE BARBOSA",
    },
  ];

  const renderIne = (row: ItemType) => {
    return row.id;
  };

  return (
    <PagedTable<ItemType>
      columns={[
        {
          header: "ID",
          name: "id",
          render: renderIne,
          sortable: true,
        },
        {
          header: "Name",
          name: "name",
          render: renderIne,
          sortable: true,
        },
        {
          header: "Age",
          name: "age",
          render: renderIne,
          sortable: true,
        },
        {
          name: "buttons",
          render: renderIne,
          style: {
            textAlign: "right",
          },
        },
      ]}
      onPageChange={function noRefCheck() {}}
      onSizeChange={function noRefCheck() {}}
      onSortChange={function noRefCheck() {}}
      page={0}
      rows={options}
      size={10}
      sizeOptions={[10, 30, 50, 100]}
      sort={["-id", "name"]}
      totalElements={10}
      totalPages={1}
    />
  );
}
