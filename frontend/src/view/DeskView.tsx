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
  // Estados para controlar a exibição dos modais e armazenar os dados
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [isModalConfirmReservation, setIsModalConfirmReservation] =
    useState(false);
  const [tableNumber, setTableNumber] = useState(0);
  const [data, setData] = useState([]);

  // Efeito de busca periódica por dados das mesas ocupadas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/queryMesasOcupadas");
        setData(response.data);
      } catch {}
    };

    fetchData();

    // Use setInterval para atualizar os dados das mesas ocupadas a cada 5 segundos
    const interval = setInterval(fetchData, 5000);

    // Limpa o intervalo
    return () => {
      clearInterval(interval);
    };
  }, [isModalConfirmReservation]);

  // Array para armazenar o conteúdo repetido das mesas
  const renderRepeatedContent = [];

  // Loop para renderizar botões para cada mesa
  for (let mesaAtual = 1; mesaAtual <= numberTables; mesaAtual++) {
    // busca das mesas ocupadas
    const mesaOcupada = data.find((item) => item === mesaAtual);

    // Determinar o tipo do botão com base na ocupação da mesa
    const typeButton = mesaOcupada ? "danger" : "primary";

    // Determinar o texto do tooltip com base na ocupação da mesa
    const textTooltip = mesaOcupada ? "Ocupado" : "Clique para reservar";

    renderRepeatedContent.push(
      // Componente de célula de grade para organizar os botões das mesas
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

  // Função para tratar o clique no botão da mesa que abre o modal de confirmação
  const handleButtonClick = (
    tableNumber: number,
    mesaOcupada: number | undefined
  ) => {
    mesaOcupada
      ? setIsModalOrderOpen(true)
      : setIsModalConfirmReservation(true);
    setTableNumber(tableNumber);
  };

  // Função para reservar a mesa e fechar o modal de confirmação
  const reservarMesa = async () => {
    try {
      await api.post("/insertMesaOcupada", {
        numero: tableNumber,
      });
      setIsModalConfirmReservation(false);
    } catch {}
  };

  // Descrição para o modal de confirmação
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
      {/* Componente Header para o título da página */}
      <Header title="Início"></Header>
      {/* Componente ModalOrder para abrir o modal de fazer pedido */}
      <ModalOrder
        open={isModalOrderOpen}
        onClose={() => setIsModalOrderOpen(false)}
        tableNumber={tableNumber}
      ></ModalOrder>
      {/* Componente ModalConfirm para abrir o modal de confirmação de reserva de mesa */}
      <ModalConfirm
        open={isModalConfirmReservation}
        onClose={() => setIsModalConfirmReservation(false)}
        onChange={reservarMesa}
        title={"Confirmar reserva?"}
        description={descriptionModalConfirm}
      ></ModalConfirm>
      {/*Conteudo da pagina principal, ou seja, os botões das mesas */}
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

// Estilos CSS utilizando a biblioteca emotion/react
const boldTableNumberStyle = css`
  font-weight: bold;
`;
