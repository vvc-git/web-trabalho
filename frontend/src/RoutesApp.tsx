import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import { Context } from "./context/AuthProvider";
import { LoginView } from "./view/LoginView";
import { DeskView } from "./view/DeskView";
import { Redirect } from "react-router-dom";
import { EditView } from "./view/EditView";
import { FinalSummary } from "./view/FinalSummary";
import { ListUsersView } from "./view/ListUsersView";
import { Spinner } from "react-bootstrap";
import { userRoutes } from "./components/Helpers";
import { ProductsView } from "./view/ProductsView";

interface CustomRouteProps {
  isPrivate?: boolean;
  exact?: boolean;
  path: string;
  component: React.ComponentType;
}

const routePaths = [
  "/",
  "/perfil",
  "/cadastrar",
  "/editar",
  "/finalizar",
  "/usuarios",
  "/produtos",
  "/sair",
  "/auth",
];

function CustomRoute(props: CustomRouteProps) {
  const { isPrivate, ...rest } = props;
  const { loading, authenticated, typeUser } = useContext(Context);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!routePaths.includes(rest.path)) {
    if (authenticated) {
      return <Redirect to="/" />;
    } else {
      return <Redirect to="/auth" />;
    }
  }

  if (isPrivate && !authenticated) {
    return <Redirect to="/auth" />;
  }

  if (authenticated && rest.path === "/auth") {
    return <Redirect to="/" />;
  }

  // Verificar se o tipo de usuário tem permissão para acessar a rota
  if (
    isPrivate &&
    userRoutes[typeUser] &&
    !userRoutes[typeUser].includes(rest.path)
  ) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
}

export default function RoutesApp() {
  return (
    <Switch>
      <CustomRoute isPrivate exact path="/" component={DeskView} />
      <CustomRoute isPrivate exact path="/perfil" component={EditView} />
      <CustomRoute isPrivate exact path="/cadastrar" component={EditView} />
      <CustomRoute isPrivate exact path="/editar" component={EditView} />
      <CustomRoute isPrivate exact path="/finalizar" component={FinalSummary} />
      <CustomRoute isPrivate exact path="/usuarios" component={ListUsersView} />
      <CustomRoute isPrivate exact path="/produtos" component={ProductsView} />
      <CustomRoute exact path="/sair" component={LoginView} />
      <CustomRoute exact path="/auth" component={LoginView} />
      <Redirect to="/" />;
    </Switch>
  );
}