#!/bin/bash

# Função para limpar o terminal
function clear_terminal {
    clear
}

# Função para instalar as dependências do frontend e iniciar o servidor de desenvolvimento
function start_frontend {
    echo "Instalando dependências do frontend..."
    cd frontend
    npm install
    echo "Iniciando o frontend..."
    npm start
}

# Função para instalar as dependências do backend e iniciar o servidor
function start_backend {
    echo "Instalando dependências do backend..."
    cd backend
    npm install
    echo "Iniciando o backend..."
    npm start
}

# Função para iniciar o servidor do MongoDB
function start_mongodb {
    echo "Parando o servidor do MongoDB..."
    sudo systemctl stop mongod
    echo "Iniciando o servidor do MongoDB..."
    sudo systemctl start mongod
}

# Função para remover processos na porta 3000 e 4000
function remove_process {
    # Remover qualquer processo na porta 3000
    echo "Removendo qualquer processo na porta 3000..."
    kill -9 $(lsof -t -i:3000)

    # Remover qualquer processo na porta 4000
    echo "Removendo qualquer processo na porta 4000..."
    kill -9 $(lsof -t -i:4000)
}

# Limpar o terminal
clear_terminal

# Remove os processos
remove_process

# Iniciar o servidor do MongoDB
start_mongodb

# Iniciar o backend em segundo plano
start_backend &

# Esperar alguns segundos para o backend iniciar
sleep 5

# Iniciar o frontend
start_frontend