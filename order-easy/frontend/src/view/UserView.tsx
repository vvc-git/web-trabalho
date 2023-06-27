import { VFlow } from "bold-ui";
import React, { useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { useLocation } from "react-router-dom";
import { typesEmployees, usuarios } from "../components/Helpers";
import { UserType } from "./ListUsersView";
import { FormProfile } from "../components/FormProfile";

export interface OptionType {
  value: number;
  label: string;
}

export function UserView() {
  const location = useLocation();
  const { id, editProfile, listUsers, addUser, viewProfile } = location.state;

  console.log(location.state);
  const findUserById = (userId: string | undefined) => {
    return usuarios.find((user) => user.id === userId);
  };

  const findType = (userType: number | undefined) => {
    return typesEmployees.find((type) => type.value === userType);
  };

  const user: UserType | undefined = findUserById(id);
  const type: OptionType | undefined = findType(user?.type.value);

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
