const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

function getCollection(client, collection) {
  const db = client.db("DB_ORDER_EASY");
  const col = db.collection(collection);
  return col;
}

async function insertEmployee(name, cpf, position, password, collection) {
  const doc = {
    name: name,
    cpf: cpf,
    position: position,
    password: password,
  };
  await collection
    .insertOne(doc)
    .catch((msg) => console.log("Erro ao inserir funcionário"));
}

async function insertMesaOcupada(numero, collection) {
  const doc = {
    numero: numero,
  };

  const existingMesa = await collection.findOne({ numero });
  if (existingMesa) {
    throw new Error("Mesa já está ocupada.");
  }

  await collection.insertOne(doc).catch(() => {
    throw new Error("Erro ao reservar mesa.");
  });

  return true;
}

async function queryMesasOcupadas(collection) {
  const docs = await collection
    .find()
    .toArray()
    .catch(() => {
      throw new Error("Erro ao buscar mesas reservadas.");
    });

  const numeros = docs.map((doc) => doc.numero);

  return numeros;
}

async function hasEmployee(user, collection) {
  const query = { user: user };
  const res = await collection
    .findOne(query)
    .catch((msg) => console.log("Erro na promise do ExisteFuncionario"));
  if (res) return true;
  return false;
}

async function getPasswordFromCPF(user, collection) {
  console.log(user);
  const query = { user: user };
  const res = await collection
    .findOne({ cpf: Number(user) })
    .catch((msg) => console.log("Erro na promise do ExisteFuncionario"));

  if (res) {
    return res.password;
  }
  return null;
}

async function getIDFromCPF(cpf, collection) {
  const query = { cpf: cpf };
  const res = await collection
    .findOne(query)
    .catch((msg) => console.log("Erro na promise do ExisteFuncionario"));

  if (res) {
    return res._id;
  }
  return null;
}

async function deleteEmployee(collection, cpf) {
  const query = {
    cpf: cpf,
  };
  await collection.deleteOne(query);
}

async function deleteAllEmplyee(collection) {
  // const res = await collection.deleteMany();
  // console.log(`itens deleteados${res.deletedCount}`)
  const res = await collection.deleteMany();
}

async function getUserFromID(id, collection) {
  const oid = new ObjectId(id);
  const query = { _id: oid };
  const res = await collection
    .findOne(query)
    .catch((msg) => console.log("Erro na promise do ExisteFuncionario"));
  if (res) {
    return res;
  }
  return null;
}

async function printFuncionario(nome, collection) {
  const query = { nome: nome };
  const res = await collection
    .findOne(query)
    .catch((msg) => console.log("Erro na promise de printar usuario" + msg));
  if (res) return res.nome;

  return null;
}
module.exports = {
  getCollection,
  insertEmployee,
  hasEmployee,
  deleteAllEmplyee,
  getPasswordFromCPF,
  getIDFromCPF,
  getUserFromID,
  insertMesaOcupada,
  queryMesasOcupadas,
};
