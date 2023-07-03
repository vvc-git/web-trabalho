import { VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { useLocation } from "react-router-dom";
import { UserTypeDB } from "./ListUsersView";
import { FormProfile } from "../components/FormProfile";
import api from "../api";

export interface OptionType {
  value: number;
  label: string;
}

export function EditView() {
  // State para armazenar os dados do usuário
  const [user, setUser] = useState<UserTypeDB | undefined>(undefined);

  // Hook useLocation para obter o objeto de localização
  const location = useLocation();

  // Variáveis ​​de estado passadas por location.state
  const { id, editUser, addUser, viewUser } = location.state || {};

  // UseEffect para buscar os dados do usuário na API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Consulta o usuário específico com base no ID ou no usuário armazenado localmente
        const singleUser = await api.post("/querySingleUser", {
          user: editUser ? id : localStorage.getItem("user"),
        });
        console.log("Entrei");
        setUser(singleUser.data);
      } catch {}
    };
    // Se for uma visualização de usuário ou adição de usuário, ou se não houver dados de localização, busca o usuário
    if (editUser || viewUser || !location.state) fetchUser();
  }, [id, viewUser, editUser, location.state]);

  // Obter o tipo de usuário
  const type: OptionType | undefined = user?.type;

  return (
    <>
      <VFlow>
        {/* Componente Header para exibir o título da página */}
        <Header
          title={
            viewUser
              ? "Perfil"
              : addUser
              ? "Cadastrar usuário"
              : "Editar usuário"
          }
        ></Header>
        <PageContainer>
          {/* Componente FormProfile para exibir o formulário de perfil do usuário */}
          <FormProfile
            user={user}
            type={type}
            addUser={addUser}
            editUser={editUser}
            viewUser={viewUser || !location.state}
          ></FormProfile>
        </PageContainer>
      </VFlow>
    </>
  );
}
