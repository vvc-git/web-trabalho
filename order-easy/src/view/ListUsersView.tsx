/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Button,
  Cell,
  DataTable,
  Grid,
  HFlow,
  Icon,
  Tooltip,
  VFlow,
} from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { usuarios } from "../components/Helpers";
import { ModalConfirm } from "../components/ModalConfirm";
import { useNavigate } from "react-router-dom";
import { OptionType } from "./UserView";
import { Total } from "../components/Total";

interface ListUsersViewProps {
  num?: number;
  perfil?: boolean;
}

export interface UserType {
  id: string;
  name: string;
  type: OptionType;
  user: number;
  password?: string;
  confirmPassword?: string;
}

export function ListUsersView(props: ListUsersViewProps) {
  const usersBD = usuarios;

  const navigate = useNavigate();

  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [listUsers, setListUsers] = useState<UserType[] | undefined>(usersBD);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    setListUsers(usersBD);
  }, []);

  const handleRemoveClick = (users: UserType) => {
    setSelectedUser(users);
    setIsModalConfirmOpen(true);
  };

  const handleRemoveUser = () => {
    const updatedUsers = listUsers?.filter(
      (u) => u.user !== selectedUser?.user
    );
    setListUsers(updatedUsers ? updatedUsers : listUsers);
    setIsModalConfirmOpen(false);
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    navigate("/perfil", {
      state: { id: user.id, editProfile: true, listUsers: true },
    });
  };

  const handleAddClick = () => {
    navigate("/perfil", {
      state: { listUsers: true, editProfile: false, addUser: true },
    });
  };

  const renderName = (users: UserType) => {
    return users.name;
  };

  const renderType = (users: UserType) => {
    return users.type.label;
  };

  const renderButton = (users: UserType) => {
    return (
      <div>
        <Tooltip text="Editar">
          <Button
            size="small"
            skin="ghost"
            onClick={() => handleEditClick(users)}
          >
            <Icon icon="penOutline" style={penIconStyles} />
          </Button>
        </Tooltip>
        <Tooltip text="Excluir">
          <Button
            size="small"
            skin="ghost"
            onClick={() => handleRemoveClick(users)}
          >
            <Icon icon="trashOutline" style={trachIconStyles} />
          </Button>
        </Tooltip>
      </div>
    );
  };

  const descriptionModalConfirm = (
    <p>
      Você confirma a exclusão do usuário{" "}
      <span css={boldNameStyle}>{selectedUser?.name}</span>?
    </p>
  );

  return (
    <>
      <ModalConfirm
        open={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        onChange={handleRemoveUser}
        title={"Excluir cadastro?"}
        description={descriptionModalConfirm}
      ></ModalConfirm>
      <Header title="Usuários"></Header>
      <PageContainer>
        <VFlow>
          <Grid>
            <Cell xs={12} sm={12} md={4} lg={2}>
              <Button
                kind="primary"
                size="large"
                style={buttonCadastrarStyles}
                onClick={handleAddClick}
              >
                Cadastrar novo usuário
              </Button>
            </Cell>
            <Cell xs={12} sm={12} md={12} lg={12}>
              <div css={divTableStyles}>
                <DataTable<UserType>
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
                  rows={listUsers}
                />
              </div>
            </Cell>
          </Grid>
        </VFlow>
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

const boldNameStyle = css`
  font-weight: bold;
`;

const buttonCadastrarStyles = css`
  width: 100%;
`;
