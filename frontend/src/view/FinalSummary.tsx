/** @jsxImportSource @emotion/react */
import { VFlow } from "bold-ui";
import React, { Fragment, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { AccordionFinalSummary } from "../components/AccordionFinalSummary";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import api from "../api";

const chef = require("../img/chef.png");

export function FinalSummary() {
  const [mesasOcupadas, setMesasOcupadas] = useState([]);

  const fetchDataMesasOcupadas = async () => {
    try {
      const mesasOcupadas = await api.get("/queryMesasOcupadas");
      setMesasOcupadas(mesasOcupadas.data);
    } catch {}
  };

  useEffect(() => {
    fetchDataMesasOcupadas();
  }, []);

  const renderRepeatedContent = (tableNumber: number) => (
    <AccordionFinalSummary
      tableNumber={tableNumber}
      fetchDataMesasOcupadas={fetchDataMesasOcupadas}
    ></AccordionFinalSummary>
  );

  return (
    <Fragment>
      <Header title="Finalizar"></Header>
      <PageContainer>
        <VFlow vSpacing={2}>
          {mesasOcupadas.length === 0 && (
              <h1>Nenhuma mesa foi reservada.</h1>
            ) && (
              <>
                <div css={stylesDivMesasVazias}>
                  <img src={chef} alt="Chef" css={stylesImageChef} />
                </div>
                <h2 css={stylesTextoChef}>
                  Nenhuma mesa
                  <br />
                  foi reservada.
                </h2>
              </>
            )}
          {mesasOcupadas &&
            mesasOcupadas.map((value) => renderRepeatedContent(value))}
        </VFlow>
      </PageContainer>
    </Fragment>
  );
}

const stylesDivMesasVazias = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const stylesImageChef = css`
  width: auto;
  max-width: 50%;
`;

const stylesTextoChef = css`
  margin-top: 1.5rem;
  font-weight: bold;
  word-wrap: break-word;
  text-align: center;
  font-style: italic;
`;
