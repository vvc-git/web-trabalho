/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Button,
  HFlow,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  Text,
  VFlow,
} from "bold-ui";
import React, { ReactNode } from "react";

interface ModalConfirmProps {
  open: boolean;
  onClose(): void;
  onChange(): void;
  title: string;
  description: ReactNode;
}

export function ModalConfirm(props: ModalConfirmProps) {
  const { open, onClose, onChange, title, description } = props;

  return (
    <Modal
      size="small"
      onClose={onClose}
      open={open}
      style={modalStyles}
      closeOnBackdropClick={false}
    >
      <ModalBody>
        <VFlow>
          <HFlow alignItems="center">
            <Icon
              icon="infoCircleFilled"
              style={{ marginRight: "0.5rem" }}
              size={3}
              fill="info"
            />
            <Heading level={1}>{title}</Heading>
          </HFlow>
          <Text component="p" variant="main">
            {description}
          </Text>
        </VFlow>
      </ModalBody>
      <ModalFooter>
        <HFlow justifyContent="flex-end">
          <Button kind="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button kind="primary" onClick={onChange}>
            Concluir
          </Button>
        </HFlow>
      </ModalFooter>
    </Modal>
  );
}

const modalStyles = css`
  p {
    font-size: 1rem;
  }
  @media (max-width: 767px) {
    min-width: 100% !important;
  }
`;
