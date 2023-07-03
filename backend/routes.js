const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./auth");
const router = express.Router();
const { client } = require("./mongodb");
const cpfCheck = require('cpf-check');

const {
  getCollection,
  getPasswordAndTypeFromCPF,
  queryMesasOcupadas,
  insertMesaOcupada,
  freeTable,
  queryOrdersByTable,
  registerOrder,
  removeOrder,
  queryAllProducts,
  addProduct,
  removeProduct,
  hasEmployee,
  insertEmployee,
  queryAllUsers,
  querySingleUser,
  removeSingleUser,
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
  const collectionUsers = getCollection("listUsers", client);

  // verifica se o usuario esta no bando de dados pegando sua senha
  const { dbPassword, type } = await getPasswordAndTypeFromCPF(
    collectionUsers,
    user
  );

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
      type: type.label,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Erro ao gerar token",
    });
  }
});

// rotas a partir daqui são privadas
router.use(authMiddleware);

// rota para logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout realizado com sucesso!");
});

// busca mesas ocupadas
router.get("/queryMesasOcupadas", async (_, res) => {
  try {
    const collection = getCollection("mesaOcupada", client);
    const mesaOcupada = await queryMesasOcupadas(collection);
    res.status(200).json(mesaOcupada);
  } catch (err) {
    res.status(422).json({ msg: "Erro ao buscar mesas ocupadas" });
  }
});

// reserva mesa
router.post("/insertMesaOcupada", async (req, res) => {
  const { numero } = req.body;

  const collectionMesaOcupada = getCollection("mesaOcupada", client);

  try {
    await insertMesaOcupada(collectionMesaOcupada, numero);
    res.status(200).json({ msg: "Mesa reservada com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao reservar mesa" });
  }
});

// libera mesa e exclui seus pedidop
router.post("/freeTable", async (req, res) => {
  const { tableNumber } = req.body;

  try {
    const collectionOrders = getCollection("orders", client);
    const collectionMesasOcupadas = getCollection("mesaOcupada", client);
    await freeTable(collectionOrders, collectionMesasOcupadas, tableNumber);
    res.status(200).json({ msg: "Pedido finalizado com sucesso! " });
  } catch {
    res.status(422).json({ msg: "Erro ao encerrar pedido" });
  }
});

// busca todos os pedidos de uma mesa
router.post("/queryOrdersByTable", async (req, res) => {
  const { tableNumber } = req.body;

  try {
    const collection = getCollection("orders", client);
    const orders = await queryOrdersByTable(collection, tableNumber);
    res.status(200).json(orders);
  } catch {
    res.status(422).json({ msg: "Erro ao buscar pedidos da mesa" });
  }
});

// registra pedidos de uma mesa
router.post("/registerOrder", async (req, res) => {
  const { order } = req.body;

  const collectionRegisterOrder = getCollection("orders", client);

  try {
    await registerOrder(collectionRegisterOrder, order);
    res.status(200).json({ msg: "Pedido realizado com sucesso!" });
  } catch {
    return res.status(472).json({ msg: "Erro ao criar pedido" });
  }
});

// remove um pedido
router.post("/removeOrder", async (req, res) => {
  const { idOrder } = req.body;
  const collectionUsers = getCollection("orders", client);
  try {
    await removeOrder(collectionUsers, idOrder);
    res.status(200).json({ msg: "Pedido removido com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao remover pedido" });
  }
});

// busca mesas ocupadas
router.get("/queryAllProducts", async (_, res) => {
  try {
    const collection = getCollection("products", client);
    const allProducts = await queryAllProducts(collection);
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(422).json({ msg: "Erro ao buscar produtos" });
  }
});

// registra um produto
router.post("/addProduct", async (req, res) => {
  const { product } = req.body;
  const collectionRegisterOrder = getCollection("products", client);

  try {
    await addProduct(collectionRegisterOrder, product);
    res.status(200).json({ msg: "Produto cadastrado com sucesso!" });
  } catch {
    return res.status(472).json({ msg: "Erro ao cadastrar produto" });
  }
});

// remove um produto
router.post("/removeProduct", async (req, res) => {
  const { idProduct } = req.body;

  const collectionUsers = getCollection("products", client);
  try {
    await removeProduct(collectionUsers, idProduct);
    res.status(200).json({ msg: "Produto removido com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao remover produto" });
  }
});

// cadastro e atualização de usuário
router.post("/register", async (req, res) => {
  const { formValues, editUser } = req.body;
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

  if (user != Number(20104135) && user != Number(20103689)) {
    if (!cpfCheck.validate(user)) {
      return res.status(422).json({ msg: "Este número de CPF não é válido" });
    }
  }
  const collectionUsers = getCollection("listUsers", client);

  // verifica se o usuário já existe no banco de dados em caso de novo cadastro
  if (!editUser) {
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
  await insertEmployee(collectionUsers, name, user, type, passwordHash);
  res.status(201).json({ msg: "Usuário criado com sucesso! " });
});

// busca todos os usuários
router.get("/queryAllUsers", async (_, res) => {
  const collectionUsers = getCollection("listUsers", client);
  try {
    allUsers = await queryAllUsers(collectionUsers);
    res.status(200).json(allUsers);
  } catch {
    return res.status(422).json({ msg: "Erro ao retornar usuários" });
  }
});

// busca um único usuário
router.post("/querySingleUser", async (req, res) => {
  const { user } = req.body;

  const collectionUsers = getCollection("listUsers", client);

  try {
    singleUser = await querySingleUser(collectionUsers, user);
    res.status(200).json(singleUser);
  } catch {
    return res.status(422).json({ msg: "Erro ao encontrar usuário" });
  }
});

// remove um único usuário
router.post("/removeSingleUser", async (req, res) => {
  const { userRemove } = req.body;
  const collectionUsers = getCollection("listUsers", client);

  const { user } = req.headers;

  if (userRemove === 20103689 || userRemove === 20104135) {
    return res.status(422).json({ msg: "Você não pode excluir este usuário." });
  }

  if (Number(user) === Number(userRemove)) {
    return res
      .status(422)
      .json({ msg: "Você não pode excluir o seu usuário." });
  }
  try {
    await removeSingleUser(collectionUsers, userRemove);
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao remover usuário" });
  }
});

module.exports = router;
