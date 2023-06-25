/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
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

interface AccordionFinalSummaryProps {
  numAccordion: number;
}

const blueArrow = require("../img/seta-fundo-azul.svg").default;
const whiteArrow = require("../img/seta-fundo-branco.svg").default;

export function AccordionFinalSummary(props: AccordionFinalSummaryProps) {
  const { numAccordion } = props;

  return (
    <Accordion>
      <Accordion.Item eventKey={numAccordion.toString()} css={headerStyles}>
        <Accordion.Header>
          Mesa {formatNumberWithTwoDigits(numAccordion)}
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
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Coca Cola</TableCell>
                    <TableCell>R$3,00</TableCell>
                    <TableCell style={totalStyles}>R$3,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell>Batata Frita (200g)</TableCell>
                    <TableCell>R$15,00</TableCell>
                    <TableCell style={totalStyles}>R$45,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5</TableCell>
                    <TableCell>Hamburguer Double Bacon</TableCell>
                    <TableCell>R$30,00</TableCell>
                    <TableCell style={totalStyles}>R$150</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </VFlow>
          </div>
          <Grid style={gridStyles}>
            <Cell xs={8} sm={8} md={6} lg={6} alignSelf="center">
              <Total value={9000.25}></Total>
            </Cell>
            <Cell xs={4} sm={4} md={6} lg={6}>
              <HFlow justifyContent="flex-end">
                <Button kind="primary">Concluir</Button>
              </HFlow>
            </Cell>
          </Grid>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

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
