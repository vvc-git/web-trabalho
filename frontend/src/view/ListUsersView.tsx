/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, DataTable, Grid, Icon, Tooltip, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { ModalConfirm } from "../components/ModalConfirm";
import { OptionType } from "./EditView";
import { useHistory, useLocation } from "react-router-dom";
import api from "../api";
import { Alert } from "react-bootstrap";
import { handleApiError } from "../components/Helpers";

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
  type: OptionType;
  password?: string;
}

export function ListUsersView() {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const { successMessage } = location.state || {};

  const [listUsersDB, setListUsersDB] = useState<UserTypeDB[] | undefined>([
    {
      _id: "",
      name: "",
      user: 0,
      type: { label: "", value: 0 },
      password: "",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<UserTypeDB | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const executeQueryAllUsers = async () => {
    try {
      const response = await api.get("/queryAllUsers");
      const allUsers = response.data;
      setListUsersDB(allUsers);
    } catch {}
  };

  useEffect(() => {
    executeQueryAllUsers();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timerId = setTimeout(() => {
        history.push(location.pathname, null);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [successMessage, location.pathname, history]);

  const handleRemoveClick = (users: UserTypeDB) => {
    setSelectedUser(users);
    setIsModalConfirmOpen(true);
  };

  const handleRemoveUser = async () => {
    try {
      await api.post("/removeSingleUser", {
        userRemove: selectedUser ? selectedUser.user : "0",
      });
      setIsModalConfirmOpen(false);
      executeQueryAllUsers();
    } catch (error) {
      handleApiError(error, setErrorMessage);
      setIsModalConfirmOpen(false);
    }
  };

  const handleEditClick = (user: UserTypeDB) => {
    setSelectedUser(user);
    history.push("/editar", {
      id: user.user,
      editUser: true,
    });
  };

  const handleAddClick = () => {
    history.push("/cadastrar", {
      addUser: true,
    });
  };

  const renderName = (users: UserTypeDB) => {
    return users.name;
  };

  const renderType = (users: UserTypeDB) => {
    return users.type.label;
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
              {successMessage && (
                <Alert variant="success" css={alertStyles}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="danger" css={alertStyles}>
                  {errorMessage}
                </Alert>
              )}
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

const alertStyles = css`
  margin-bottom: 0 !important;
`;
