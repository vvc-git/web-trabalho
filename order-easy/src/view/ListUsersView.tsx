/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, DataTable, Icon, Tooltip } from "bold-ui";
import React from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";

interface ListUsersViewProps {
  num?: number;
  perfil?: boolean;
}

interface ItemType {
  name: string;
  type: string;
}

export function ListUsersView(props: ListUsersViewProps) {
  const { num, perfil } = props;
  const options = [
    {
      name: "José Daniel Alves do Prado",
      type: "Supervisor",
    },
    {
      name: "Victor do Valle",
      type: "Supervisor",
    },
    {
      name: "Ana Cláudia Gonçaves da Silva",
      type: "Caixa",
    },
    {
      name: "Fernanda Cezar da Costa",
      type: "Caixa",
    },
    {
      name: "Giovana Aparecida dos Santos",
      type: "Caixa",
    },
    {
      name: "Leonardo Ribeiro de Alencar Bueno",
      type: "Atendimento",
    },
    {
      name: "Gustavo Aurélio deOliveira",
      type: "Atendimento",
    },
  ];

  const renderName = (row: ItemType) => {
    return row.name;
  };

  const renderType = (row: ItemType) => {
    return row.type;
  };

  const renderButton = () => {
    return (
      <div>
        <Tooltip text="Editar">
          <Button size="small" skin="ghost" onClick={() => {}}>
            <Icon icon="penOutline" style={penIconStyles} />
          </Button>
        </Tooltip>
        <Tooltip text="Excluir">
          <Button size="small" skin="ghost" onClick={() => {}}>
            <Icon icon="trashOutline" style={trachIconStyles} />
          </Button>
        </Tooltip>
      </div>
    );
  };
  return (
    <>
      <Header title="Usuários"></Header>
      <PageContainer>
        <div css={divTableStyles}>
          <DataTable<ItemType>
            style={tableOrderStyles}
            columns={[
              {
                header: "Nome",
                name: "name",
                render: renderName,
              },
              {
                header: "Tipo",
                name: "type",
                render: renderType,
              },
              {
                name: "buttons",
                render: renderButton,
                style: {
                  textAlign: "right",
                  width: "150px",
                },
              },
            ]}
            hovered
            rows={options}
          />
        </div>
      </PageContainer>
    </>
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

const penIconStyles = css`
  color: #232323 !important;
`;

const divTableStyles = css`
  overflow: auto;
  border: 1px solid #d3d4dd;
  border-radius: 0.375rem !important;
  border-bottom: none;
`;
