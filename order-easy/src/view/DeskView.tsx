/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid } from "bold-ui";
import { Fragment, useState } from "react";
import { ModalOrder } from "../components/ModalOrder";
import React from "react";
import {
  RepeatComponent,
  formatNumberWithTwoDigits,
} from "../components/RepeatComponent";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";

interface DeskViewProps {
  numDesks: number;
}

export function DeskView(props: DeskViewProps) {
  const { numDesks } = props;
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [tableNumer, setTableNumber] = useState("0");

  const renderRepeatedContent = (index: number) => (
    <Cell xs={12} sm={6} md={4} lg={3}>
      <Button
        block
        kind="primary"
        onClick={() => handleButtonClick(index.toString())}
        size="large"
        skin="default"
      >
        {formatNumberWithTwoDigits(index)}
      </Button>
    </Cell>
  );

  const handleButtonClick = (numberTable: string) => {
    setIsModalOrderOpen(true);
    setTableNumber(numberTable);
  };

  return (
    <Fragment>
      <Header title="Início"></Header>
      <ModalOrder
        open={isModalOrderOpen}
        onClose={() => setIsModalOrderOpen(false)}
        tableNumer={tableNumer}
      ></ModalOrder>
      <PageContainer>
        <Grid
          alignItems="center"
          direction="row"
          gap={2}
          gapVertical={2}
          justifyContent="center"
          wrap
          style={gridStyles}
        >
          <RepeatComponent times={numDesks}>
            {renderRepeatedContent}
          </RepeatComponent>
        </Grid>
      </PageContainer>
    </Fragment>
  );
}

const gridStyles = css`
  //width: 100%;
`;
