require("dotenv").config();

/* imports */
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { MongoClient } = require("mongodb");

const {
  getCollection,
  insertEmployee,
  hasEmployee,
  getPasswordFromCPF,
  getIDFromCPF,
  getUserFromID,
  insertMesaOcupada,
  queryMesasOcupadas,
  registerOrders,
  queryOrdersByDesk,
} = require("./data");

const app = express();
const session = require("express-session");

app.use(
  session({
    secret: "sua-chave-secreta-aqui",
    resave: false,
    saveUninitialized: true,
  })
);

var port = 4000;

// permitindo acesso de outras origens
app.use(cors());

// Configurando respostas JSON
app.use(express.json());

// Variveis para o banco de dados
const localhost = `localhost`;
const dbPort = 27017;
const dbName = process.env.DB_NAME;
const MONGO_URL = `mongodb://` + localhost + `/` + dbPort + `/` + dbName;

// Abrindo a porta para conexões
app.listen(port);

// Criando um novo cliente do banco de dados
var client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
client
  .connect()
  .catch((msg) => console.log("Erro na conexao com o banco de dados" + msg));

//login

app.post("/login", async (req, res) => {
  const { user, password } = req.body;
  console.log("Cheguei aqui");
  // Validações
  if (!user) {
    return res.status(442).json({ msg: "O campo CPF é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O campo senha é obrigatório" });
  }

  // Verificar se o usuário já existe no banco de dados
  const collectionUsers = getCollection(client, "listUsers");

  const dbPassword = await getPasswordFromCPF(user, collectionUsers);
  console.log("Cheguei aqui5");
  if (!dbPassword) {
    return res.status(404).json({ msg: "O usuário não foi encontrado :(" });
  }
  console.log("Cheguei aqui2");
  // Verifica se senha é equivalente com a que foi salva no banco
  // Obs: O bcrypt tem um formato padrão que possibilita saber onde está o salt, o hash e custo para poder comparar os hash.
  const checkPassword = await bcrypt.compare(password, dbPassword);
  if (!checkPassword) {
    return res.status(442).json({ msg: "Senha inválida :(" });
  }
  console.log("Entrei aqui1");
  try {
    console.log("gerando token");
    const token = jwt.sign(user, "PRIVATEKEY");
    console.log(token);
    return res.json({
      user: Number(user),
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Erro ao gerar token",
    });
  }
  console.log("Entrei aqui2");
});

app.get("/status", (req, res) => {
  const isAuthenticated = req.session.isAuthenticated || false;
  console.log(req.session.isAuthenticated);
  res.json({ isAuthenticated });
});

async function validate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const [, token] = authorization.split(" ");

  try {
    await promisify(jwt.verify)(token, "PRIVATEKEY");

    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout realizado com sucesso!");
});

// reserva mesa
app.post("/insertMesaOcupada", async (req, res) => {
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
app.get("/queryAllUsers", async (_, res) => {
  const collectionUsers = getCollection(client, "listUsers");
  try {
    const allUsers = await collectionUsers.find().toArray();

    res.status(200).json(allUsers);
  } catch {
    return res.status(422).json({ msg: "Erro ao retornar usuários" });
  }
});

// busca um único usuário
app.post("/querySingleUser", async (req, res) => {
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
app.post("/removeSingleUser", async (req, res) => {
  const { userRemove } = req.body;
  const collectionUsers = getCollection(client, "listUsers");
  try {
    await collectionUsers.deleteOne({ user: Number(userRemove) });
    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch {
    return res.status(422).json({ msg: "Erro ao remover usuário" });
  }
});

//busca mesas ocupadas
app.get("/queryMesasOcupadas", async (_, res) => {
  try {
    const collection = getCollection(client, "mesaOcupada");
    const mesaOcupada = await queryMesasOcupadas(collection);
    res.status(200).json(mesaOcupada);
  } catch (err) {
    res.status(422).json({ msg: "Erro ao buscar mesas ocupadas" });
  }
});

// registra pedidos de uma mesa
app.post("/registerOrder", async (req, res) => {
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
app.post("/queryOrdersByDesk", async (req, res) => {
  const { numberDesk } = req.body;

  try {
    const collection = getCollection(client, "registerOrder");
    const orders = await queryOrdersByDesk(collection, numberDesk);
    res.status(200).json(orders);
  } catch {
    res.status(422).json({ msg: "Erro ao buscar pedidos da mesa" });
  }
});

app.post("/register", async (req, res) => {
  const { formValues, editProfile } = req.body;
  const { name, password, passwordConfirm, type, user } = formValues;

  // Validacoes
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
  if (password !== passwordConfirm) {
    return res.status(422).json({ msg: "As senhas devem ser iguais!" });
  }

  const collectionUsers = getCollection(client, "listUsers");

  if (!editProfile) {
    // Verificar se o usuário já existe no banco de dados
    const userExists = await hasEmployee(collectionUsers, user);

    if (userExists) {
      return res
        .status(422)
        .json({ msg: "Esse usuário já foi cadastrado, utilize outro!" });
    }
  }
  // Cria uma senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insere o novo funcionario no banco de dados
  insertEmployee(collectionUsers, name, user, type, passwordHash);
  res.status(201).json({ msg: "Usuário criado com sucesso! " });
});

// libera mesa e exclui seus pedidop
app.post("/freeDesk", async (req, res) => {
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
