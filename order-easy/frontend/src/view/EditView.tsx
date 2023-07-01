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

  const { id, editProfile, listUsers, addUser, viewProfile } =
    location.state || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const singleUser = await api.post("/querySingleUser", {
          user: id ? id : localStorage.getItem("user"),
        });
        setUser(singleUser.data);
      } catch {}
    };
    if (editProfile && id) fetchUser();
    else if (!addUser) fetchUser();
  }, [id, addUser, editProfile]);

  const type: OptionType | undefined = user?.position;

  return (
    <>
      <VFlow>
        <Header title={!true ? "Perfil" : "Cadastrar usuário"}></Header>
        <PageContainer>
          <FormProfile
            user={user}
            type={type}
            addUser={addUser}
            editProfile={editProfile}
            listUsers={listUsers}
            viewProfile={viewProfile}
          ></FormProfile>
        </PageContainer>
      </VFlow>
    </>
  );
}
