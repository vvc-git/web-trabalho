import axios from "axios";
import { OptionType } from "../view/EditView";

// Número de mesas
export const numberTables = 28;

// Tipos de funcionários
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

// Rotas de usuário
export const userRoutes: Record<string, string[]> = {
  Atendimento: ["/", "/auth", "/perfil", "/sair"],
  Caixa: ["/", "/auth", "/perfil", "/sair", "/finalizar", "/produtos"],
  Supervisor: [
    "/",
    "/auth",
    "/perfil",
    "/sair",
    "/finalizar",
    "/cadastrar",
    "/editar",
    "/usuarios",
    "/produtos",
  ],
};

// Formata um número para ter dois dígitos
export const formatNumberWithTwoDigits = (number: number): string =>
  number < 10 ? `0${number}` : String(number);

// Trata erros da API
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
