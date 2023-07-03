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

// interface do objeto usuário
export interface UserType {
  id: string;
  name: string;
  type: OptionType;
  user: number;
  password?: string;
  confirmPassword?: string;
}

// interface do objeto usuário no banco de dados
export interface UserTypeDB {
  _id: string;
  name: string;
  user: number;
  type: OptionType;
  password?: string;
}

export function ListUsersView() {
  // State para controlar a abertura/fechamento do modal de confirmação
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  // retorna o objeto de localização que representa a URL atual.
  const location = useLocation();

  // retorna o objeto de histórico, que permite a navegação.
  const history = useHistory();

  // Mensagem de sucesso vinda da rota anterior
  const { successMessage } = location.state || {};

  // State para armazenar a lista de usuários listados
  const [listUsersDB, setListUsersDB] = useState<UserTypeDB[] | undefined>([
    {
      _id: "",
      name: "",
      user: 0,
      type: { label: "", value: 0 },
      password: "",
    },
  ]);
  // State para armazenar o usuário selecionado para remoção
  const [selectedUser, setSelectedUser] = useState<UserTypeDB | null>(null);

  // State para armazenar a mensagem de erro
  const [errorMessage, setErrorMessage] = useState("");

  // Função para buscar todos os usuários da API
  const executeQueryAllUsers = async () => {
    try {
      const response = await api.get("/queryAllUsers");
      const allUsers = response.data;
      setListUsersDB(allUsers);
    } catch {}
  };

  // UseEffect para buscar todos os usuários quando o componente é montado
  useEffect(() => {
    executeQueryAllUsers();
  }, []);

  // UseEffect para remover o conteudo do location.pathname para a mensagem de sucesso desaparecer
  useEffect(() => {
    if (successMessage) {
      const timerId = setTimeout(() => {
        history.push(location.pathname, null);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [successMessage, location.pathname, history]);

  // Função para lidar com o clique no botão de remoção de usuário
  const handleRemoveClick = (users: UserTypeDB) => {
    setSelectedUser(users);
    setIsModalConfirmOpen(true);
  };

  // Função para remover um usuário
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

  // Função para lidar com o clique no botão de edição de usuário
  const handleEditClick = (user: UserTypeDB) => {
    setSelectedUser(user);
    history.push("/editar", {
      id: user.user,
      editUser: true,
    });
  };

  // Função para lidar com o clique no botão de adição de usuário
  const handleAddClick = () => {
    history.push("/cadastrar", {
      addUser: true,
    });
  };

  // Função para renderizar o nome do usuário na tabela
  const renderName = (users: UserTypeDB) => {
    return users.name;
  };

  // Função para renderizar o tipo do usuário na tabela
  const renderType = (users: UserTypeDB) => {
    return users.type.label;
  };

  // Função para renderizar os botões de ação (editar e excluir) na tabela
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

  // Conteúdo do modal de confirmação de exclusão de usuário
  const descriptionModalConfirm = (
    <p>
      Você confirma a exclusão do usuário{" "}
      <span css={boldNameStyle}>{selectedUser?.name}</span>?
    </p>
  );

  return (
    <>
      {/* Componente ModalConfirm para confirmar a exclusão do usuário */}
      <ModalConfirm
        open={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        onChange={handleRemoveUser}
        title={"Excluir cadastro?"}
        description={descriptionModalConfirm}
      ></ModalConfirm>
      {/* Componente Header para o título */}
      <Header title="Usuários"></Header>

      {/* Componente PageContainer */}
      <PageContainer>
        <VFlow>
          <Grid>
            <Cell xs={12} sm={12} md={4} lg={2}>
              {/* Botão para adicionar um novo usuário */}
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
              {/* Exibição de mensagens de sucesso ou erro */}
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
                {/* Componente DataTable para exibir a tabela de usuários */}
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

// Estilos CSS específicos para a tabela
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
