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
  const [user, setUser] = useState<UserTypeDB | undefined>(undefined);

  const location = useLocation();

  const { id, editUser, addUser, viewUser } = location.state || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const singleUser = await api.post("/querySingleUser", {
          user: editUser ? id : localStorage.getItem("user"),
        });
        console.log("Entrei");
        setUser(singleUser.data);
      } catch {}
    };
    if (editUser || viewUser || !location.state) fetchUser();
  }, [id, viewUser, editUser, location.state]);

  const type: OptionType | undefined = user?.type;

  return (
    <>
      <VFlow>
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
