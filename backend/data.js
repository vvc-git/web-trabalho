require("dotenv").config();

function getCollection(collection, client) {
  const db = client.db("DB_ORDER_EASY");
  const col = db.collection(collection);
  return col;
}

async function getPasswordAndTypeFromCPF(collection, user) {
  const res = await collection.findOne({ user: Number(user) }).catch(() => {
    return { error: "Erro ao buscar usuário pelo CPF." };
  });
  if (res) {
    if (res.password && res.type) {
      return { dbPassword: res.password, type: res.type };
    }
  }
  return null;
}

async function queryMesasOcupadas(collection) {
  const docs = await collection
    .find()
    .sort({ numero: 1 })
    .toArray()
    .catch(() => {
      return { error: "Erro ao buscar mesas reservadas." };
    });

  return docs.map((doc) => doc.numero);
}

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

async function queryOrdersByTable(collection, tableNumber) {
  try {
    const orders = await collection.find({ table: tableNumber }).toArray();
    return orders;
  } catch {
    return { error: "Erro ao buscar pedidos da mesa." };
  }
}

async function registerOrder(collection, order) {
  try {
    await collection.insertOne(order);
  } catch {
    return { error: "Erro ao registrar pedido." };
  }
}

async function removeOrder(collection, idOrder) {
  try {
    await collection.deleteOne({ idOrder: idOrder });
  } catch {
    return { error: "Erro ao remover pedido." };
  }
}

async function queryAllProducts(collection) {
  const allProducts = await collection
    .find()
    .toArray()
    .catch(() => {
      return { error: "Erro ao buscar produtos." };
    });

  return allProducts;
}

async function addProduct(collection, product) {
  try {
    await collection.insertOne(product);
  } catch {
    return { error: "Erro ao cadastrar produto." };
  }
}

async function removeProduct(collection, idProduct) {
  try {
    await collection.deleteOne({ value: idProduct });
  } catch {
    return { error: "Erro ao remover produto." };
  }
}

async function hasEmployee(collection, user) {
  const query = { user: Number(user) };
  const res = await collection.findOne(query).catch(() => {
    return { error: "Erro ao buscar usuário." };
  });
  if (res) return true;
  return false;
}

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

async function queryAllUsers(collection) {
  try {
    const allUsers = await collection.find().toArray();
    return allUsers;
  } catch {
    return { error: "Erro ao buscar todos os usuários." };
  }
}

async function querySingleUser(collection, user) {
  try {
    const singleUser = await collection.findOne({ user: Number(user) });
    return singleUser;
  } catch {
    return { error: "Erro ao buscar usuário." };
  }
}

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
