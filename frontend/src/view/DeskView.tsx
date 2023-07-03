/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, Tooltip } from "bold-ui";
import { Fragment, useEffect, useState } from "react";
import { ModalOrder } from "../components/ModalOrder";
import React from "react";
import { formatNumberWithTwoDigits, numberTables } from "../components/Helpers";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import { ModalConfirm } from "../components/ModalConfirm";
import api from "../api";

export function DeskView() {
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalConfirmReservation, setIsModalConfirmReservation] =
    useState(false);
  const [tableNumber, setTableNumber] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/queryMesasOcupadas");
        setData(response.data);
      } catch {}
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isModalConfirmReservation]);

  const renderRepeatedContent = [];

  for (let mesaAtual = 1; mesaAtual <= numberTables; mesaAtual++) {
    const mesaOcupada = data.find((item) => item === mesaAtual);
    const typeButton = mesaOcupada ? "danger" : "primary";
    const textTooltip = mesaOcupada ? "Ocupado" : "Clique para reservar";

    renderRepeatedContent.push(
      <Cell xs={12} sm={6} md={4} lg={3} key={mesaAtual}>
        <Tooltip text={textTooltip}>
          <Button
            block
            kind={typeButton}
            onClick={() => handleButtonClick(mesaAtual, mesaOcupada)}
            size="large"
            skin="default"
          >
            MESA {formatNumberWithTwoDigits(mesaAtual)}
          </Button>
        </Tooltip>
      </Cell>
    );
  }

  const handleButtonClick = (
    tableNumber: number,
    mesaOcupada: number | undefined
  ) => {
    mesaOcupada
      ? setIsModalOrderOpen(true)
      : setIsModalConfirmReservation(true);
    setTableNumber(tableNumber);
  };

  const reservarMesa = async () => {
    try {
      await api.post("/insertMesaOcupada", {
        numero: tableNumber,
      });
      setIsModalConfirmReservation(false);
    } catch {}
  };

  const descriptionModalConfirm = (
    <p>
      Você deseja reservar a{" "}
      <span css={boldTableNumberStyle}>
        MESA {formatNumberWithTwoDigits(tableNumber)}
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
        tableNumber={tableNumber}
      ></ModalOrder>
      <ModalConfirm
        open={isModalConfirmReservation}
        onClose={() => setIsModalConfirmReservation(false)}
        onChange={reservarMesa}
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
          {renderRepeatedContent}
        </Grid>
      </PageContainer>
    </Fragment>
  );
}

const boldTableNumberStyle = css`
  font-weight: bold;
`;
