/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Context } from "../context/AuthProvider";
import { useHistory } from "react-router-dom";

const whiteNavbarToggleIcon = require("../img/navbar-toggle-icon.png");

export function Menu() {
  const { handleLogout } = useContext(Context);
  const [menuUsuarios, setMenuUsuarios] = useState(false);
  const [menuFinalizar, setMenuFinalizar] = useState(false);
  const [menuProdutos, setMenuProdutos] = useState(false);

  const history = useHistory();

  const redirectToProfile = () => {
    history.push("/perfil", {
      viewUser: true,
    });
  };

  const typeUser = localStorage.getItem("type");

  useEffect(() => {
    setMenuUsuarios(typeUser === "Supervisor");
    setMenuFinalizar(typeUser === "Supervisor" || typeUser === "Caixa");
    setMenuProdutos(typeUser === "Supervisor" || typeUser === "Caixa");
  }, [typeUser]);

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className="bg-body-tertiary"
      css={navStyles}
      variant="dark"
    >
      <Container css={containerStyles}>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" css={linkStyles}>
              Início
            </Nav.Link>
            {typeUser === "Supervisor"}
            {menuUsuarios && (
              <Nav.Link href="/usuarios" css={linkStyles}>
                Usuários
              </Nav.Link>
            )}
            {menuProdutos && (
              <Nav.Link href="/produtos" css={linkStyles}>
                Produtos
              </Nav.Link>
            )}
            {menuFinalizar && (
              <Nav.Link href="/finalizar" css={linkStyles}>
                Finalizar
              </Nav.Link>
            )}
            <Nav.Link onClick={redirectToProfile} css={linkStyles}>
              Perfil
            </Nav.Link>
            <Nav.Link href="#" css={linkStyles} onClick={handleLogout}>
              Sair
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const navStyles = css`
  background: none !important;
  font-family: "IBM Plex Sans", sans-serif !important;

  .navbar-toggler {
    border: 2px solid white !important;
  }

  .navbar-toggler-icon {
    background-image: url("${whiteNavbarToggleIcon}") !important;
  }
`;

const containerStyles = css`
  width: 100%;
  margin: 0 auto !important;
  max-width: 1600px;
  padding-left: 2rem !important;
  text-transform: uppercase;
`;

const linkStyles = css`
  color: white !important;
  font-weight: bold;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-right: 1.5rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: white;
    transition: width 0.3s ease-in-out;
  }

  &:hover::after {
    width: 100%;
  }
`;
