export const formatNumberWithTwoDigits = (number: number): string =>
  number < 10 ? `0${number}` : String(number);

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
    desk: 9,
  },
];
