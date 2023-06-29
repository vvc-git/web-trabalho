const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./auth");
const router = express.Router();
const { client } = require("./mongodb");

const {
  getCollection,
  insertEmployee,
  hasEmployee,
  getPasswordFromCPF,
  insertMesaOcupada,
  queryMesasOcupadas,
  registerOrders,
  queryOrdersByDesk,
} = require("./data");

// rota para fazer login
router.post("/login", async (req, res) => {
  const { user, password } = req.body;

  // validações de obrigatoriedade dos campos
  if (!user) {
    return res.status(442).json({ msg: "O campo CPF é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O campo SENHA é obrigatório" });
  }

  // pegando "tabela" de usuarios
  const collectionUsers = getCollection(client, "listUsers");

  // verifica se o usuario esta no bando de dados pegando sua senha
  const dbPassword = await getPasswordFromCPF(user, collectionUsers);

  if (!dbPassword) {
    return res.status(404).json({ msg: "O usuário não foi encontrado :(" });
  }

  // verifica se senha é equivalente com a que foi salva no banco
  // obs: O bcrypt tem um formato padrão que possibilita saber onde está o salt, o hash e custo para poder comparar os hash.
  const checkPassword = await bcrypt.compare(password, dbPassword);

  if (!checkPassword) {
    return res.status(442).json({ msg: "Senha inválida :(" });
  }

  // gerador de token
  try {
    const token = jwt.sign(user, "PRIVATEKEY");

    return res.json({
      user: Number(user),
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Erro ao gerar token",
    });
  }
});

router.use(authMiddleware);

// rota para logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout realizado com sucesso!");
});

// reserva mesa
router.post("/insertMesaOcupada", async (req, res) => {
  const { numero } = req.body;

  const collectionMesaOcupada = getCollection(client, "mesaOcupada");

  try {
    insertMesaOcupada(numero, collectionMesaOcupada);
    res.status(200).json({ msg: "Mesa reservada com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao reservar mesa" });
  }
});

// busca todos os usuários
router.get("/queryAllUsers", async (_, res) => {
  const collectionUsers = getCollection(client, "listUsers");
  try {
    const allUsers = await collectionUsers.find().toArray();

    res.status(200).json(allUsers);
  } catch {
    return res.status(422).json({ msg: "Erro ao retornar usuários" });
  }
});

// busca um único usuário
router.post("/querySingleUser", async (req, res) => {
  const { user } = req.body;

  const collectionUsers = getCollection(client, "listUsers");

  try {
    const singleUser = await collectionUsers.findOne({ user: Number(user) });
    res.status(200).json(singleUser);
  } catch {
    return res.status(422).json({ msg: "Erro ao encontrar usuário" });
  }
});

// remove um único usuário
router.post("/removeSingleUser", async (req, res) => {
  const { userRemove } = req.body;
  const collectionUsers = getCollection(client, "listUsers");
  try {
    await collectionUsers.deleteOne({ user: Number(userRemove) });
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao remover usuário" });
  }
});

// busca mesas ocupadas
router.get("/queryMesasOcupadas", async (_, res) => {
  try {
    const collection = getCollection(client, "mesaOcupada");
    const mesaOcupada = await queryMesasOcupadas(collection);
    res.status(200).json(mesaOcupada);
  } catch (err) {
    res.status(422).json({ msg: "Erro ao buscar mesas ocupadas" });
  }
});

// registra pedidos de uma mesa
router.post("/registerOrder", async (req, res) => {
  const { pedidos, desk } = req.body;
  const collectionRegisterOrder = getCollection(client, "registerOrder");

  try {
    await collectionRegisterOrder.deleteMany({ desk: desk });

    for (const pedido of pedidos) {
      const { id, order, amount, price, desk } = pedido;

      await registerOrders(
        id,
        order,
        amount,
        price,
        desk,
        collectionRegisterOrder
      );
    }

    res.status(200).json({ msg: "Pedido realizado com sucesso!" });
  } catch {
    return res.status(472).json({ msg: "Erro ao criar pedido" });
  }
});

// busca todos os pedidos de uma mesa
router.post("/queryOrdersByDesk", async (req, res) => {
  const { numberDesk } = req.body;

  try {
    const collection = getCollection(client, "registerOrder");
    const orders = await queryOrdersByDesk(collection, numberDesk);
    res.status(200).json(orders);
  } catch {
    res.status(422).json({ msg: "Erro ao buscar pedidos da mesa" });
  }
});

// libera mesa e exclui seus pedidop
router.post("/freeDesk", async (req, res) => {
  const { numberDesk } = req.body;

  try {
    const collectionOrders = getCollection(client, "registerOrder");
    const collectionMesasOcupadas = getCollection(client, "mesaOcupada");

    await collectionOrders.deleteMany({ desk: numberDesk });
    await collectionMesasOcupadas.deleteMany({ numero: numberDesk });

    res.status(200).json({ msg: "Pedido finalizado com sucesso! " });
  } catch {
    res.status(422).json({ msg: "Erro ao encerrar pedido" });
  }
});

// cadastro e atualização de usuário
router.post("/register", async (req, res) => {
  const { formValues, editProfile } = req.body;
  const { name, password, passwordConfirm, type, user } = formValues;

  // validações de obrigatoriedade dos campos
  if (!name) {
    return res.status(422).json({ msg: "Campo NOME é obrigatório!" });
  }

  if (!user) {
    return res.status(422).json({ msg: "Campo USUÁRIO é obrigatório!" });
  }

  if (!type) {
    return res.status(422).json({ msg: "Campo TIPO é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Campo SENHA é obrigatório!" });
  }

  if (!passwordConfirm) {
    return res
      .status(422)
      .json({ msg: "Campo CONFIRME A SENHA é obrigatório" });
  }

  // validação de senhas iguais
  if (password !== passwordConfirm) {
    return res.status(422).json({ msg: "As senhas devem ser iguais!" });
  }

  const collectionUsers = getCollection(client, "listUsers");

  // verifica se o usuário já existe no banco de dados em caso de novo cadastro
  if (!editProfile) {
    const userExists = await hasEmployee(collectionUsers, user);

    if (userExists) {
      return res
        .status(422)
        .json({ msg: "Esse usuário já foi cadastrado, utilize outro!" });
    }
  }

  // cria uma senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // insere o novo funcionario no banco de dados
  insertEmployee(collectionUsers, name, user, type, passwordHash);
  res.status(201).json({ msg: "Usuário criado com sucesso! " });
});

module.exports = router;
