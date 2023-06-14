import { Button, Cell, Grid } from "bold-ui";
import { Fragment, useState } from "react";
import { ModalOrder } from "../components/ModalOrder";
import React from "react";
import { PageContainer } from "../components/PageContainer";

const numDesks = Array.from({ length: 12 }, (_, index) => index + 1);

export function DeskView() {
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [tableNumer, setTableNumber] = useState("0");

  const handleButtonClick = (numberTable: string) => {
    setIsModalOrderOpen(true);
    setTableNumber(numberTable);
  };

  return (
    <Fragment>
      <PageContainer>
        <ModalOrder
          open={isModalOrderOpen}
          onClose={() => setIsModalOrderOpen(false)}
          tableNumer={tableNumer}
        ></ModalOrder>
        <Grid
          alignItems="center"
          direction="row"
          gap={2}
          gapVertical={2}
          justifyContent="center"
          wrap
        >
          {numDesks.map((value) => (
            <Cell xs={12} sm={6} md={4} lg={3}>
              <Button
                block
                kind="primary"
                onClick={() => handleButtonClick(value.toString())}
                size="large"
                skin="default"
              >
                {value}
              </Button>
            </Cell>
          ))}
        </Grid>
      </PageContainer>
    </Fragment>
  );
}
