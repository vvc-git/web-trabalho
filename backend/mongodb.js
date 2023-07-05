require("dotenv").config();

const { MongoClient } = require("mongodb");

// variveis para o banco de dados
const localhost = `localhost`;
const dbPort = 27017;
const DB_NAME = process.env.DB_NAME;
const MONGO_URL = `mongodb://` + localhost + `/` + dbPort + `/` + DB_NAME;

// criando um novo cliente do banco de dados
const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

// conectando ao banco de dados
async function connectToDatabase() {
  try {
    await client.connect();

    console.log("Conectado ao banco de dados MongoDB");

    return client;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
