/** @jsxImportSource @emotion/react */
import {
  Button,
  Cell,
  Grid,
  Heading,
  HFlow,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  VFlow,
} from "bold-ui";
import { css } from "@emotion/react";
import React from "react";
import { SelectItemsOrder } from "./SelectItemsOrder";

interface ModalOrderProps {
  open: boolean;
  onClose(): void;
  tableNumer: string;
}
export function ModalOrder(props: ModalOrderProps) {
  const { open, onClose, tableNumer } = props;

  const buttonAdicionarStyles = css`
    padding: calc(0.4rem - 1px) 1rem !important;
  `;

  return (
    <>
      <Modal size="large" onClose={onClose} open={open}>
        <ModalBody>
          <VFlow>
            <HFlow alignItems="center">
              <Icon
                icon="cutleryFilled"
                style={{ marginRight: "0.5rem" }}
                size={3}
                fill="info"
              />
              <Heading level={1}>Pedido da Mesa {tableNumer}</Heading>
            </HFlow>
            <Grid>
              <Cell xs={10} sm={10} md={10} lg={10}>
                <SelectItemsOrder></SelectItemsOrder>
              </Cell>
              <Cell xs={1} sm={1} md={1} lg={1}>
                <Button
                  size="medium"
                  skin="default"
                  kind="primary"
                  style={buttonAdicionarStyles}
                >
                  Adicionar
                </Button>
              </Cell>
            </Grid>
          </VFlow>
        </ModalBody>
        <ModalFooter>
          <HFlow justifyContent="flex-end">
            <Button onClick={onClose}>Sair</Button>
            <Button kind="primary" onClick={onClose}>
              Concluir
            </Button>
          </HFlow>
        </ModalFooter>
      </Modal>
    </>
  );
}
