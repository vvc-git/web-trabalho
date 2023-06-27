/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, Tooltip } from "bold-ui";
import { Fragment, useState } from "react";
import { ModalOrder } from "../components/ModalOrder";
import React from "react";
import { RepeatComponent } from "../components/RepeatComponent";
import {
  formatNumberWithTwoDigits,
  mesasOcupadas,
} from "../components/Helpers";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { ModalConfirm } from "../components/ModalConfirm";

interface DeskViewProps {
  numDesks: number;
}

export function DeskView(props: DeskViewProps) {
  const { numDesks } = props;
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalConfirmReservation, setIsModalConfirmReservation] =
    useState(false);
  const [tableNumer, setTableNumber] = useState(0);

  const renderRepeatedContent = (index: number) => {
    const mesaOcupada = mesasOcupadas.find((item) => item === index);
    const typeButton = mesaOcupada ? "danger" : "primary";
    const textTooltip = mesaOcupada ? "Ocupado" : "Clique para reservar";

    return (
      <Cell xs={12} sm={6} md={4} lg={3}>
        <Tooltip text={textTooltip}>
          <Button
            block
            kind={typeButton}
            onClick={() => handleButtonClick(index, mesaOcupada)}
            size="large"
            skin="default"
          >
            MESA {formatNumberWithTwoDigits(index)}
          </Button>
        </Tooltip>
      </Cell>
    );
  };

  const handleButtonClick = (
    numberTable: number,
    mesaOcupada: number | undefined
  ) => {
    mesaOcupada
      ? setIsModalOrderOpen(true)
      : setIsModalConfirmReservation(true);
    setTableNumber(numberTable);
  };

  const descriptionModalConfirm = (
    <p>
      Você deseja reservar a
      <span css={boldTableNumberStyle}>
        {" "}
        MESA {formatNumberWithTwoDigits(tableNumer)}
      </span>
      ?
    </p>
  );

  return (
    <Fragment>
      <Header title="Início"></Header>
      <ModalOrder
        open={isModalOrderOpen}
        onClose={() => setIsModalOrderOpen(false)}
        tableNumer={tableNumer}
      ></ModalOrder>
      <ModalConfirm
        open={isModalConfirmReservation}
        onClose={() => setIsModalConfirmReservation(false)}
        onChange={() => setIsModalConfirmReservation(false)}
        title={"Confirmar reserva?"}
        description={descriptionModalConfirm}
      ></ModalConfirm>
      <PageContainer>
        <Grid
          alignItems="center"
          direction="row"
          gap={2}
          gapVertical={2}
          justifyContent="center"
          wrap
        >
          <RepeatComponent times={numDesks}>
            {renderRepeatedContent}
          </RepeatComponent>
        </Grid>
      </PageContainer>
    </Fragment>
  );
}

const boldTableNumberStyle = css`
  font-weight: bold;
`;
