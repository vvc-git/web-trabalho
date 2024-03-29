/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Button,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  VFlow,
} from "bold-ui";
import React from "react";

// Interface dos tipos de objetos da Prop do componente
interface ModalForgetPasswordProps {
  open: boolean;
  onClose(): void;
}

// Componente de modal de esqueci minha senha
export function ModalForgetPassword(props: ModalForgetPasswordProps) {
  const { open, onClose } = props;

  // Retorna o modal
  return (
    <Modal size="small" onClose={onClose} open={open} style={modalStyles}>
      <ModalBody>
        <VFlow>
          <HFlow alignItems="center">
            <Icon
              icon="infoCircleFilled"
              style={{ marginRight: "0.5rem" }}
              size={3}
              fill="info"
            />
            <Heading level={1}>Alterar senha</Heading>
          </HFlow>
          <Text component="p" variant="main">
            Por favor, entre em contato com o seu supervisor para alterar sua
            senha.
          </Text>
        </VFlow>
      </ModalBody>
      <ModalFooter>
        <HFlow justifyContent="flex-end">
          <Button kind="primary" onClick={onClose}>
            Concluir
          </Button>
        </HFlow>
      </ModalFooter>
    </Modal>
  );
}

// Estilos CSS utilizando a biblioteca emotion
const modalStyles = css`
  p {
    font-size: 1rem;
  }
  @media (max-width: 767px) {
    min-width: 100% !important;
  }
`;
