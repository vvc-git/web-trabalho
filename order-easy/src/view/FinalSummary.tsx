/** @jsxImportSource @emotion/react */
import { VFlow } from "bold-ui";
import React, { Fragment } from "react";
import { AccordionFinalSummary } from "../components/AccordionFinalSummary";
import { RepeatComponent } from "../components/RepeatComponent";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";

interface FinalSummaryProps {
  numAccordions: number;
}

export function FinalSummary(props: FinalSummaryProps) {
  const { numAccordions } = props;

  const renderRepeatedContent = (index: number) => (
    <AccordionFinalSummary numAccordion={index}></AccordionFinalSummary>
  );

  return (
    <Fragment>
      <Header title="Finalizar"></Header>
      <PageContainer>
        <VFlow vSpacing={3}>
          <RepeatComponent times={numAccordions} addVFlow>
            {renderRepeatedContent}
          </RepeatComponent>
        </VFlow>
      </PageContainer>
    </Fragment>
  );
}
