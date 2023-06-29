/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, DataTable, Grid, Icon, Tooltip, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { ModalConfirm } from "../components/ModalConfirm";
import { OptionType } from "./EditView";
import axios from "axios";
import { useHistory } from "react-router-dom";

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

export interface UserTypeDB {
  _id: string;
  name: string;
  user: number;
  position: OptionType;
  password?: string;
}

export function ListUsersView(props: ListUsersViewProps) {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const history = useHistory();
  const [listUsersDB, setListUsersDB] = useState<UserTypeDB[] | undefined>([
    {
      _id: "",
      name: "",
      user: 0,
      position: { label: "", value: 0 },
      password: "",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<UserTypeDB | null>(null);

  const executeQueryAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/queryAllUsers");
      const allUsers = response.data;
      setListUsersDB(allUsers);
    } catch {}
  };

  useEffect(() => {
    executeQueryAllUsers();
  }, []);

  const handleRemoveClick = (users: UserTypeDB) => {
    setSelectedUser(users);
    setIsModalConfirmOpen(true);
  };

  const handleRemoveUser = async () => {
    try {
      await axios.post("http://localhost:4000/removeSingleUser", {
        userRemove: selectedUser ? selectedUser.user : "0",
      });
      setIsModalConfirmOpen(false);
      executeQueryAllUsers();
    } catch {}
  };

  const handleEditClick = (user: UserTypeDB) => {
    setSelectedUser(user);
    history.push("/editar", {
      id: user.user,
      userView: user.user,
      editProfile: true,
      listUsers: true,
    });
  };

  const handleAddClick = () => {
    history.push("/cadastrar", {
      listUsers: true,
      editProfile: false,
      addUser: true,
    });
  };

  const renderName = (users: UserTypeDB) => {
    return users.name;
  };

  const renderType = (users: UserTypeDB) => {
    return users.position.label;
  };

  const renderButton = (users: UserTypeDB) => {
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
                <DataTable<UserTypeDB>
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
                  rows={listUsersDB}
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
