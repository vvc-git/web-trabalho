/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const whitePattern = require("../img/navbar-toggle-icon.png");

export function Menu() {
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
            <Nav.Link href="#features" css={linkStyles}>
              Início
            </Nav.Link>
            <Nav.Link href="#features" css={linkStyles}>
              Usuários
            </Nav.Link>
            <Nav.Link href="#features" css={linkStyles}>
              Finalizar
            </Nav.Link>
            <Nav.Link href="#features" css={linkStyles}>
              Perfil
            </Nav.Link>
            <Nav.Link href="#features" css={linkStyles}>
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
    background-image: url("${whitePattern}") !important;
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
