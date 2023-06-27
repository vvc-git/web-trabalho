require("dotenv").config();

/* imports */
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

// Rota pública para acessar a aplicação
app.get("/", (_, res) => {
  res.status(200).json({ msg: "Bem vindo" });
});

// Criação de um middleware
function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Primeiro verifico se veio alguma coisa em authHeader e (&&) extraio o token do header

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

// Rota privada
// Uso de middleware para bloquear o acesso publico
app.get("/user/:id", checkToken, async (req, res) => {
  // Pegando o id pelo parametro
  const id = req.params.id;
  // Verifica se usuario existe
  const collectionFuncionarios = getCollection(client, "user");

  const user = await getUserFromID(id, collectionFuncionarios);
  if (!user) {
    res.status(404).json({ msg: "Conta do usuário não encontrado" });
  }
  res.status(200).json({ user });
});

// Credenciais do banco de dados
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWOR;

// // TODO: Colocar dentro do connect o endereço do servidor da UFSC
// mongoose.connect(MONGO_URL).then(() => {
//     console.log('Conectou ao banco')
// }
// ).catch((err)=> console.log(err))

// Conectando com o monngoclient

// function onConnected(client){
//     db = client.db('DB_ORDER_EASY');
//     const collection = db.collection('user');
//     insertFuncionario("Lucas", "Vendedor", collection);

// }

// }

// client.connect().then(onConnected)

// Login do Usuário
app.post("/login", async (req, res) => {
  const { user, password } = req.body;

  // Validações
  if (!user) {
    return res.status(442).json({ msg: "Campo USUÁRIO obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "Campo SENHA obrigatório!" });
  }

  // Verificar se o usuário já existe no banco de dados
  const collectionUsers = getCollection(client, "listUsers");

  const dbPassword = await getPasswordFromCPF(user, collectionUsers);

  if (!dbPassword) {
    return res.status(404).json({ msg: "O usuário não foi encontrado :(" });
  }

  // Verifica se senha é equivalente com a que foi salva no banco
  // Obs: O bcrypt tem um formato padrão que possibilita saber onde está o salt, o hash e custo para poder comparar os hash.
  const checkPassword = await bcrypt.compare(password, dbPassword);
  if (!checkPassword) {
    return res.status(442).json({ msg: "Senha inválida" });
  }

  const id = await getIDFromCPF(user, collectionUsers);
  try {
    // Envia o token para o usuário conseguir se autenticar depois
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: id,
      },
      secret
    );

    return res.status(200).json({ msg: "Autenticação com sucesso", token });
  } catch (err) {
    res.status(500).json({
      msg: "Erro no servidor",
    });
  }
});

// Registro de usuario

//----------------------------------------------------------------

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
    const singleUser = await collectionUsers.findOne({ user: user });
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
    await collectionUsers.deleteOne({ user: userRemove });
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
