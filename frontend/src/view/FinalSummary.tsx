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
  // State para armazenar as mesas ocupadas
  const [mesasOcupadas, setMesasOcupadas] = useState([]);

  // Função assíncrona para buscar as mesas ocupadas da API
  const fetchDataMesasOcupadas = async () => {
    try {
      const mesasOcupadas = await api.get("/queryMesasOcupadas");
      setMesasOcupadas(mesasOcupadas.data);
    } catch {}
  };

  // UseEffect para buscar as mesas ocupadas quando o componente é montado
  useEffect(() => {
    fetchDataMesasOcupadas();
  }, []);

  // Função para renderizar o conteúdo repetido para cada mesa ocupada
  const renderRepeatedContent = (tableNumber: number) => (
    <AccordionFinalSummary
      tableNumber={tableNumber}
      fetchDataMesasOcupadas={fetchDataMesasOcupadas}
    ></AccordionFinalSummary>
  );

  return (
    <Fragment>
      {/* Componente Header para exibir o título da página */}
      <Header title="Finalizar"></Header>
      <PageContainer>
        <VFlow vSpacing={2}>
          {/* Condição para exibir uma mensagem e imagem quando não há mesas ocupadas */}
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
          {/* Mapeamento das mesas ocupadas e renderização do conteúdo repetido, ou seja, os AccordionFinalSummary */}
          {mesasOcupadas &&
            mesasOcupadas.map((value) => renderRepeatedContent(value))}
        </VFlow>
      </PageContainer>
    </Fragment>
  );
}

// Estilos CSS utilizando a biblioteca emotion/react
const stylesDivMesasVazias = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const stylesImageChef = css`
  width: auto;
  max-width: 25%;
`;

const stylesTextoChef = css`
  margin-top: 1.5rem;
  font-weight: bold;
  word-wrap: break-word;
  text-align: center;
  font-style: italic;
`;
