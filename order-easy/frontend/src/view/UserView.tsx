import { VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { useLocation } from "react-router-dom";
import { typesEmployees, usuarios } from "../components/Helpers";
import { UserTypeDB } from "./ListUsersView";
import { FormProfile } from "../components/FormProfile";
import axios from "axios";

export interface OptionType {
  value: number;
  label: string;
}

export function UserView() {
  const location = useLocation();
  const { userView, editProfile, listUsers, addUser, viewProfile } =
    location.state;
  const [user, setUser] = useState<UserTypeDB | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async (userView: number | undefined) => {
      try {
        const singleUser = await axios.post(
          "http://localhost:4000/querySingleUser",
          {
            user: userView,
          }
        );
        setUser(singleUser.data);
      } catch {}
    };

    fetchUser(userView);
  }, [userView]);

  const type: OptionType | undefined = user?.position;

  return (
    <>
      <VFlow>
        <Header title={!addUser ? "Perfil" : "Cadastrar usuário"}></Header>
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
