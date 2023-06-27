/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, Grid, Tooltip } from "bold-ui";
import { Fragment, useEffect, useState } from "react";
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
import axios from "axios";

interface DeskViewProps {
  numDesks: number;
}

export function DeskView(props: DeskViewProps) {
  const { numDesks } = props;
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalConfirmReservation, setIsModalConfirmReservation] =
    useState(false);
  const [tableNumer, setTableNumber] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/queryMesasOcupadas"
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log("Ocorreu um erro na requisição");
      }
    };

    fetchData();
  }, [isModalConfirmReservation]);

  const renderRepeatedContent = (index: number) => {
    const mesaOcupada = data.find((item) => item === index);
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

  const reservarMesa = async () => {
    try {
      await axios.post("http://localhost:4000/insertMesaOcupada", {
        numero: tableNumer,
      });
      setIsModalConfirmReservation(false);
    } catch (error) {
      console.log(error);
    }
  };

  const descriptionModalConfirm = (
    <p>
      Você deseja reservar a{" "}
      <span css={boldTableNumberStyle}>
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
