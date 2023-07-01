/** @jsxImportSource @emotion/react */
import { VFlow } from "bold-ui";
import React, { Fragment, useEffect, useState } from "react";
import { AccordionFinalSummary } from "../components/AccordionFinalSummary";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import api from "../api";

export function FinalSummary() {
  const [data, setData] = useState([]);

  const fetchDataMesasOcupadas = async () => {
    try {
      const response = await api.get("/queryMesasOcupadas");
      setData(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchDataMesasOcupadas();
  }, []);

  const renderRepeatedContent = (numberDesk: number) => (
    <AccordionFinalSummary
      numDesk={numberDesk}
      fetchDataMesasOcupadas={fetchDataMesasOcupadas}
    ></AccordionFinalSummary>
  );

  return (
    <Fragment>
      <Header title="Finalizar"></Header>
      <PageContainer>
        <VFlow vSpacing={2}>
          {data.map((value) => renderRepeatedContent(value))}
        </VFlow>
      </PageContainer>
    </Fragment>
  );
}
