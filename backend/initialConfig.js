const { getCollection, hasEmployee, insertEmployee } = require("./data");
const { client } = require("./mongodb");
const bcrypt = require("bcrypt");

// Função para verificar e inserir os usuários principais ao iniciar o servidor
async function checkAndInsertUser() {
  const user1 = {
    name: "José Daniel",
    user: Number(20103689),
    type: {
      value: 3,
      label: "Supervisor",
    },
    password: "123",
  };

  const user2 = {
    name: "Victor do Valle",
    user: Number(20104135),
    type: {
      value: 3,
      label: "Supervisor",
    },
    password: "123",
  };

  const collectionUsers = getCollection("listUsers", client);

  const user1Exists = await hasEmployee(collectionUsers, user1.user);
  const user2Exists = await hasEmployee(collectionUsers, user2.user);

  if (!user1Exists) {
    // cria uma senha
    const salt1 = await bcrypt.genSalt(12);
    const passwordHash1 = await bcrypt.hash(user1.password, salt1);

    // insere o novo funcionario no banco de dados
    try {
      await insertEmployee(
        collectionUsers,
        user1.name,
        user1.user,
        user1.type,
        passwordHash1
      );
      console.log(user1.name, "inserido no banco de dados.");
    } catch {
      console.log("Erro ao inserir", user1.name);
    }
  }

  if (!user2Exists) {
    // cria uma senha
    const salt2 = await bcrypt.genSalt(12);
    const passwordHash2 = await bcrypt.hash(user1.password, salt2);

    // insere o novo funcionario no banco de dados
    try {
      await insertEmployee(
        collectionUsers,
        user2.name,
        user2.user,
        user2.type,
        passwordHash2
      );
      console.log(user2.name, "inserido no banco de dados.");
    } catch {
      console.log("Erro ao inserir", user2.name);
    }
  }
}

module.exports = { checkAndInsertUser };
