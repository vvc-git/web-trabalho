import axios from "axios";
import { OptionType } from "../view/EditView";

export const handleApiError = (
  error: any,
  setErrorMessage: (message: string) => void
) => {
  console.log("olha onde eu cheguei");
  console.log(error);
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
