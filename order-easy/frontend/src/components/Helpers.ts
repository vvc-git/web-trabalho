import { OptionType } from "../view/UserView";

import axios, { AxiosError } from "axios";

export const handleApiError = (
  error: any,
  setErrorMessage: (message: string) => void
) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const errorMessage = error.response.data.msg;
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage(`Ocorreu um erro na requisição: ${error.message}`);
    }
  } else {
    setErrorMessage(`Ocorreu um erro desconhecido: ${error}`);
  }
  setTimeout(() => {
    setErrorMessage("");
  }, 3000);
};

export const formatNumberWithTwoDigits = (number: number): string =>
  number < 10 ? `0${number}` : String(number);

export const typesEmployees: OptionType[] = [
  {
    value: 1,
    label: "Atendimento",
  },
  {
    value: 2,
    label: "Caixa",
  },
  {
    value: 3,
    label: "Supervisor",
  },
];

export const produtos = [
  {
    id: "1",
    item: "Coca Cola",
    price: 3.5,
  },
  {
    id: "2",
    item: "Sopa",
    price: 15.0,
  },
  {
    id: "3",
    item: "Bolachinha",
    price: 7.25,
  },
  {
    id: "4",
    item: "Sorvete",
    price: 8.78,
  },
  {
    id: "5",
    item: "Batata Frita (200g)",
    price: 35.0,
  },
  {
    id: "6",
    item: "Hamburguer",
    price: 29.9,
  },
  {
    id: "7",
    item: "Camarão",
    price: 62.0,
  },
  {
    id: "8",
    item: "Bife a Milanesa",
    price: 35.33,
  },
  {
    id: "9",
    item: "Suco",
    price: 10.0,
  },
  {
    id: "10",
    item: "Costelinha",
    price: 49.0,
  },
];

export const mesasOcupadas = [1, 3, 5, 6, 7, 8, 9, 10];

export const pedidos = [
  {
    id: "100",
    order: "Coca Cola",
    price: 3.5,
    amount: 10,
    desk: 1,
  },
  {
    id: "101",
    order: "Sopa",
    price: 15.0,
    amount: 7,
    desk: 1,
  },
  {
    id: "102",
    order: "Costelinha",
    price: 49,
    amount: 23,
    desk: 1,
  },
  {
    id: "103",
    order: "Hamburguer",
    price: 29.9,
    amount: 3,
    desk: 3,
  },
  {
    id: "104",
    order: "Camarão",
    price: 62,
    amount: 3,
    desk: 3,
  },
  {
    id: "105",
    order: "Suco",
    price: 10.0,
    amount: 8,
    desk: 1,
  },
];

export const usuarios = [
  {
    _id: "1",
    name: "José Daniel Alves do Prado",
    position: {
      value: 3,
      label: "Supervisor",
    },
    user: 61988301017,
  },
  {
    _id: "2",
    name: "Victor do Valle",
    position: {
      value: 3,
      label: "Supervisor",
    },
    user: 14318902005,
  },
  {
    _id: "3",
    name: "Ana Cláudia Gonçaves da Silva",
    position: {
      value: 2,
      label: "Caixa",
    },
    user: 57288613003,
  },
  {
    _id: "4",
    name: "Fernanda Cezar da Costa",
    position: {
      value: 2,
      label: "Caixa",
    },
    user: 41733403035,
  },
  {
    _id: "5",
    name: "Giovana Aparecida dos Santos",
    position: {
      value: 2,
      label: "Caixa",
    },
    user: 99363653056,
  },
  {
    _id: "6",
    name: "Leonardo Ribeiro de Alencar Bueno",
    position: {
      value: 1,
      label: "Atendimento",
    },
    user: 12688944002,
  },
  {
    _id: "7",
    name: "Gustavo Aurélio deOliveira",
    position: {
      value: 1,
      label: "Atendimento",
    },
    user: 73963044071,
  },
];
