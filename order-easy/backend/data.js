require("dotenv").config();

function getCollection(client, collection) {
  const db = client.db("DB_ORDER_EASY");
  const col = db.collection(collection);
  return col;
}

async function insertMesaOcupada(numero, collection) {
  const doc = {
    numero: numero,
  };

  const existingMesa = await collection.findOne({ numero });
  if (existingMesa) {
    return { error: "Mesa já está ocupada" };
  }

  await collection.insertOne(doc).catch(() => {
    return { error: "Erro ao reservar mesa" };
  });

  return true;
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

async function registerOrders(id, order, amount, price, desk, collection) {
  const doc = {
    id: id,
    order: order,
    amount: amount,
    price: price,
    desk: desk,
  };

  try {
    await collection.insertOne(doc);
    return true;
  } catch {
    return { error: "Erro ao criar pedido" };
  }
}

async function queryOrdersByDesk(collection, numberDesk) {
  try {
    const orders = await collection.find({ desk: numberDesk }).toArray();
    return orders;
  } catch {
    return { error: "Erro ao buscar pedidos da mesa" };
  }
}

async function hasEmployee(collection, user) {
  const query = { user: Number(user) };
  const res = await collection.findOne(query).catch(() => {
    return { error: "Erro ao buscar usuário" };
  });
  if (res) return true;
  return false;
}

async function insertEmployee(collection, name, user, position, password) {
  const doc = {
    name: name,
    user: Number(user),
    position: position,
    password: password,
  };

  const contain = await hasEmployee(collection, user);

  if (contain) {
    await collection
      .updateOne({ user: Number(user) }, { $set: doc })
      .catch(() => {
        return { error: "Erro ao atualizar usuário" };
      });
  } else {
    await collection.insertOne(doc).catch(() => {
      return { error: "Erro ao inserir usuário" };
    });
  }

  return true;
}

async function getPasswordFromCPF(user, collection) {
  const res = await collection.findOne({ user: Number(user) }).catch(() => {
    return { error: "Erro ao buscar usuário usuário" };
  });

  if (res) {
    return res.password;
  }
  return null;
}

module.exports = {
  getCollection,
  insertMesaOcupada,
  queryMesasOcupadas,
  registerOrders,
  queryOrdersByDesk,
  hasEmployee,
  insertEmployee,
  getPasswordFromCPF,
};
