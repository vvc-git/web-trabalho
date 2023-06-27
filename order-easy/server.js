require("dotenv").config()


/* imports */
const express = require('express')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {MongoClient} = require('mongodb')
const {getCollection, insertEmployee, hasEmployee, getPasswordFromCPF, deleteAllEmplyee, getIDFromCPF, getUserFromID} = require('./data')

// TODO : Decidir se vamos usar
// Models do mongoose
// Mongoose Ele permite que você defina modelos com esquemas claros e predefinidos, 
// representando a estrutura dos dados que serão armazenados no banco de dados MongoDB.
const mongoose = require('mongoose')
const User = require('./models/User');
const { cloneElement } = require("react")


// Variaveis e constantes para o Express
const app = express()
const host = "webtrabalho.victor.valle.vms.ufsc.br"
var port = 3000

// Configurando respostas JSON
app.use(express.json())

// Variveis para o banco de dados
const localhost = `localhost`
const dbPort = 27017
const dbName = process.env.DB_NAME
const MONGO_URL = `mongodb://` + localhost + `/` + dbPort + `/` + dbName;


// Abrindo a porta para conexões
app.listen(port)


// Criando um novo cliente do banco de dados
var client = new MongoClient(MONGO_URL, {useUnifiedTopology: true});
client.connect().catch(msg => console.log('Erro na conexao com o banco de dados' + msg))

const collectionFuncionarios = getCollection(client, 'user');
// deleteAllEmplyee(collectionFuncionarios);


// Rota pública para acessar a aplicação
app.get('/', (_, res) => {
    res.status(200).json({msg: 'Bem vindo'})
})


// Criação de um middleware
function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    // Primeiro verifico se veio alguma coisa em authHeader e (&&) extraio o token do header
   
    const token = authHeader && authHeader.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({msg: 'Acesso negado!'})
    }
    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch(error) {
        res.status(400).json({msg: "Token inválido"})
    }
}

// Rota privada
// Uso de middleware para bloquear o acesso publico
app.get("/user/:id", checkToken, async (req, res) => {

    // Pegando o id pelo parametro
    const id = req.params.id
    // Verifica se usuario existe
    const collectionFuncionarios = getCollection(client, 'user');

    const user = await getUserFromID(id, collectionFuncionarios)
    if (!user) {
        res.status(404).json({msg: 'Conta do usuário não encontrado'})
    }
    res.status(200).json({user})
})

// Credenciais do banco de dados
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWOR

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
app.post('/auth/login', async(req, res) => {
    const {cpf, password} = req.body

    
    // Validações
    if (!cpf) {
        return res.status(442).json({msg: 'O email precisa ser fornecido'})
    }
    if (!password) {
        return res.status(422).json({msg: 'A senha precisa ser fornecida'})
    }

    // Verificar se o usuário já existe no banco de dados
    const collectionFuncionarios = getCollection(client, 'user');


    const teste = await collectionFuncionarios.findOne({cpf:cpf})
    console.log(teste._id)
    
    const dbPassword = await getPasswordFromCPF(cpf, collectionFuncionarios)
    if (!cpf) {
        return res.status(404).json({msg: 'O usuário não foi encontrado'})
    }
    if (!dbPassword) {
        console.log("Senha não encontrada no banco")
    }

    // Verifica se senha é equivalente com a que foi salva no banco
    // Obs: O bcrypt tem um formato padrão que possibilita saber onde está o salt, o hash e custo para poder comparar os hash.
    const checkPassword = await bcrypt.compare(password, dbPassword)

    if (!checkPassword) {
        return res.status(442).json({msg: 'Senha inválida'})
    }

    const id = await getIDFromCPF(cpf, collectionFuncionarios)
    try {

        // Envia o token para o usuário conseguir se autenticar depois
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: id
        }, secret)
        return res.status(200).json({msg: 'Autenticação com sucesso', token})

    } catch(err) {
        console.log(err)
        res.status(500).json({
            msg: 'Erro no servidor'
        })
    }
    
})


// Registro de usuario
app.post("/auth/register", async(req, res) => {
    
    const {name, cpf, cargo, password, confirm} = req.body


    // Validacoes 
    if (!name) {
        return res.status(422).json({ms: 'É o obrigatório preecher o nome'})
    }
    if (!cpf) {
        return res.status(422).json({ms: 'É o obrigatório preecher o cpf'})
    }
    if (!cargo) {
        return res.status(422).json({ms: 'É o obrigatório preecher o cargo'})
    }
    if (!password) {
        return res.status(422).json({ms: 'É o obrigatório preecher a senha'})
    }
    if (!confirm) {
        return res.status(422).json({ms: 'É o obrigatório preecher a confirmação de senha'})
    }
    if (password !== confirm) {
        return res.status(422).json({ms: 'As senhas são diferentes'})
    }

    // Verificar se o usuário já existe no banco de dados
    const collectionFuncionarios = getCollection(client, 'user');
    const userExists = await hasEmployee(cpf, collectionFuncionarios)
    if (userExists) {
        return res.status(422).json({msg: 'Esse email já foi cadastrado, utilize outro!'})
    }

    // Cria uma senha 
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Insere o novo funcionario no banco de dados
    insertEmployee(name, cpf, cargo, passwordHash, collectionFuncionarios);
    res.status(201).json({msg: 'Usuário criado com sucesso! '});

})



