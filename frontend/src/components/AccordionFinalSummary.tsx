/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { formatNumberWithTwoDigits } from "./Helpers";
import {
  Button,
  Cell,
  Grid,
  HFlow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VFlow,
} from "bold-ui";
import { Total } from "./Total";
import { ModalConfirm } from "./ModalConfirm";
import api from "../api";
import { OrderType } from "./ModalOrder";

interface AccordionFinalSummaryProps {
  tableNumber: number;
  fetchDataMesasOcupadas(): void;
}

const blueArrow = require("../img/seta-fundo-azul.svg").default;
const whiteArrow = require("../img/seta-fundo-branco.svg").default;

// Componente de resumo final do pedido em formato de accordion
export function AccordionFinalSummary(props: AccordionFinalSummaryProps) {
  const { tableNumber, fetchDataMesasOcupadas } = props;

  // State para armazenar os pedidos
  const [pedidos, setPedidos] = useState<OrderType[]>([]);

  // State para controlar a abertura do modal de confirmação
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  // Função para buscar os pedidos da mesa
  const fetchData = async () => {
    try {
      const pedidos = await api.post("/queryOrdersByTable", {
        tableNumber: tableNumber,
      });
      setPedidos(pedidos.data);
    } catch {}
  };

  // Função para liberar a mesa
  const handleFreeTable = async () => {
    try {
      await api.post("/freeTable", {
        tableNumber: tableNumber,
      });
      fetchDataMesasOcupadas();
      fetchData();
      setModalConfirmOpen(false);
    } catch {}
  };

  // Busca os pedidos da mesa ao montar o componente e quando o número da mesa é alterado
  useEffect(() => {
    fetchData();
  }, [tableNumber]);

  // Calcula o preço total dos pedidos
  const precoTotal = pedidos.reduce(
    (total, pedido) => total + pedido.price * pedido.amount,
    0
  );

  // Abre o modal de confirmação de finalizar pedidos da mesa
  const handleFinalizeOrder = () => {
    setModalConfirmOpen(true);
  };

  // Descrição do modal de confirmação
  const descriptionModalConfirm = (
    <p>
      Deseja finalizar o pedido da
      <span css={boldDescriptionStyle}> MESA {tableNumber}</span>?
    </p>
  );

  return (
    <>
      {/* Modal de confirmação de finalização */}
      <ModalConfirm
        open={modalConfirmOpen}
        onClose={() => setModalConfirmOpen(false)}
        onChange={handleFreeTable}
        title={"Finalizar?"}
        description={descriptionModalConfirm}
      ></ModalConfirm>

      {/* Componente do Accordion que terá o resumo do pedido da mesa */}
      <Accordion>
        <Accordion.Item eventKey={tableNumber.toString()} css={headerStyles}>
          <Accordion.Header>
            Mesa {formatNumberWithTwoDigits(tableNumber)}
          </Accordion.Header>
          <Accordion.Body>
            <div css={divTableStyles}>
              <VFlow>
                <Table style={tableStyles}>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Un</TableHeader>
                      <TableHeader>Produto</TableHeader>
                      <TableHeader>Preço</TableHeader>
                      <TableHeader style={totalStyles}>Total</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidos?.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell>{value.amount}</TableCell>
                        <TableCell>{value.label}</TableCell>
                        <TableCell>{value.price.toFixed(2)}</TableCell>
                        <TableCell style={totalStyles}>
                          R$
                          {Number(
                            formatNumberWithTwoDigits(
                              value.price * value.amount
                            )
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </VFlow>
            </div>
            <Grid style={gridStyles}>
              <Cell xs={8} sm={8} md={6} lg={6} alignSelf="center">
                <Total value={precoTotal}></Total>
              </Cell>
              <Cell xs={4} sm={4} md={6} lg={6}>
                <HFlow justifyContent="flex-end">
                  <Button kind="primary" onClick={() => handleFinalizeOrder()}>
                    Concluir
                  </Button>
                </HFlow>
              </Cell>
            </Grid>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

// Estilos CSS utilizando a biblioteca emotion
const divTableStyles = css`
  width: 100%;
  overflow: auto;
  border: 1px solid #d3d4dd;
  border-radius: 10px !important;
  border-bottom: none;
`;

const tableStyles = css`
  border: none !important;
`;

const gridStyles = css`
  margin-top: 1rem;
`;

const totalStyles = css`
  color: rgb(208, 30, 41);
  font-weight: bold;
  font-size: 1.25rem;
`;

const headerStyles = css`
  h2 button {
    border-left: 4px solid #0069d0 !important;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.25rem;
    color: #232323;
  }

  .accordion-button::after {
    background-image: url(${blueArrow});
    background-size: cover;
    background-position: center;
    width: 3rem;
    height: 3rem;
  }

  .accordion-button:not(.collapsed)::after {
    background-image: url(${whiteArrow});
  }

  h2 button:not(.collapsed) {
    background-color: #0069d0 !important;
    border-left: 4px solid #0069d0 !important;
    color: white;
    box-shadow: none !important;
  }
`;

const boldDescriptionStyle = css`
  font-weight: bold;
`;
