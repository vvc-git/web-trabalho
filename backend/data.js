require("dotenv").config();

// Funções para manipulação do banco de dados
// Temos 4 coleções:
// 1. Funcionários
// 2. Mesas ocupadas
// 3. Pedidos
// 4. Produtos

// Resgata a coleção dentro do database de acordo com o cliente fornecido
function getCollection(collection, client) {
  const db = client.db("DB_ORDER_EASY");
  const col = db.collection(collection);
  return col;
}

// Resgata a senha e o tipo (cargo do funcionário) para um determinado CPF
async function getPasswordAndTypeFromCPF(collection, user) {
  const res = await collection.findOne({ user: Number(user) }).catch(() => {
    return { error: "Erro ao buscar usuário pelo CPF." };
  });
  if (res) {
    if (res.password && res.type) {
      return { dbPassword: res.password, type: res.type };
    }
  }
  return { dbPassword: null, type: null };
}

// Resgata todas as mesas ocupadas
async function queryMesasOcupadas(collection) {
  const docs = await collection
    .find()
    .sort({ numero: 1 })
    .toArray()
    .catch(() => {
      return { error: "Erro ao buscar mesas reservadas." };
    });
  
  // Lista com todas as mesas ocupadas
  return docs.map((doc) => doc.numero);
}

// Insere na coleção de mesas ocupadas 
async function insertMesaOcupada(collection, numero) {
  const doc = {
    numero: numero,
  };

  const existingMesa = await collection.findOne({ numero });
  if (existingMesa) {
    return { error: "Mesa já está ocupada." };
  }

  await collection.insertOne(doc).catch(() => {
    return { error: "Erro ao reservar mesa." };
  });

  return true;
}

// Remove da coleção de mesas ocupadas 
async function freeTable(
  collectionOrders,
  collectionMesasOcupadas,
  tableNumber
) {
  try {
    await collectionOrders.deleteMany({ table: tableNumber });
    await collectionMesasOcupadas.deleteMany({ numero: tableNumber });
    return true;
  } catch {
    return { error: "Erro ao encerrar pedido e liberar mesa." };
  }
}

// Resgata o pedido do cliente pelo o número da mesa
async function queryOrdersByTable(collection, tableNumber) {
  try {
    const orders = await collection.find({ table: tableNumber }).toArray();
    return orders;
  } catch {
    return { error: "Erro ao buscar pedidos da mesa." };
  }
}

// Insere o pedido na coleção de pedidos
async function registerOrder(collection, order) {
  try {
    await collection.insertOne(order);
  } catch {
    return { error: "Erro ao registrar pedido." };
  }
}

// Remove o pedido na coleção de pedidos
async function removeOrder(collection, idOrder) {
  try {
    await collection.deleteOne({ idOrder: idOrder });
  } catch {
    return { error: "Erro ao remover pedido." };
  }
}

// Resgasta todos os produtos disponiveis 
async function queryAllProducts(collection) {
  const allProducts = await collection
    .find()
    .toArray()
    .catch(() => {
      return { error: "Erro ao buscar produtos." };
    });

  return allProducts;
}

// Adiciona um novo pedido na coleção de pedidos
async function addProduct(collection, product) {
  try {
    await collection.insertOne(product);
  } catch {
    return { error: "Erro ao cadastrar produto." };
  }
}

// Adiciona um novo pedido na coleção de pedidos
async function removeProduct(collection, idProduct) {
  try {
    await collection.deleteOne({ value: idProduct });
  } catch {
    return { error: "Erro ao remover produto." };
  }
}

// Verifica se o funcionário existe na coleção de funcionários
async function hasEmployee(collection, user) {
  const query = { user: Number(user) };
  const res = await collection.findOne(query).catch(() => {
    return { error: "Erro ao buscar usuário." };
  });
  if (res) return true;
  return false;
}

// Insere um novo funcionário na coleção de funcionários
async function insertEmployee(collection, name, user, type, password) {
  const doc = {
    name: name,
    user: Number(user),
    type: type,
    password: password,
  };

  const contain = await hasEmployee(collection, user);

  if (contain) {
    await collection
      .updateOne({ user: Number(user) }, { $set: doc })
      .catch(() => {
        return { error: "Erro ao atualizar usuário." };
      });
  } else {
    await collection.insertOne(doc).catch(() => {
      return { error: "Erro ao inserir usuário." };
    });
  }

  return true;
}
// Resgata todos funcionário na coleção de funcionários
async function queryAllUsers(collection) {
  try {
    const allUsers = await collection.find().toArray();
    return allUsers;
  } catch {
    return { error: "Erro ao buscar todos os usuários." };
  }
}
// Resgata um funcionário específico na coleção de funcionários
async function querySingleUser(collection, user) {
  try {
    const singleUser = await collection.findOne({ user: Number(user) });
    return singleUser;
  } catch {
    return { error: "Erro ao buscar usuário." };
  }
}
// Remove um funcionário específico na coleção de funcionários
async function removeSingleUser(collection, user) {
  try {
    await collection.deleteOne({ user: Number(user) });
    return true;
  } catch {
    return { error: "Erro ao remover usuário." };
  }
}

module.exports = {
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
};
