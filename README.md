# Nome: Victor Valle Cunha

## Matrícula: 20104135

# Nome: José Daniel Alves do Prado

## Matrícula: 20103689

Nosso sistema é um sistema que gerencia pedidos de um restaurante. Nele há três tipos de usuário e com três tipos de acesso como segue:

1 - O Supervisor tem acesso total ao sistema, como a reserva de mesas e realização de pedidos, cadastro de novos usuários assim como a edição, cadastro de produtos, finalização de vendas e edição do seu própio perfil.

2 - O Caixa tem acesso às funcionalidades mencionadas acima, exceto a de cadastro e edição de usuários.

3 - Por fim, o Atendente tem o acesso às funcionalidades do Caixa, exceto a de finalização de vendas.

O usuário só pode acessar o sistema após autenticação via login com CPF e senha. Caso o mesmo esqueça da senha, oferecemos um botão informativo no qual o instrui a procurar seu supervisor para alterá-la.

O frontend do projeto foi desenvolvido usando React.js, o backend utilizamos Node.js, Express e MongoDB para salvar os dados. Para criptografar a senha utilizamos bcrypt e para a autenticação jsonwebtoken.

GitHub: https://github.com/vvc-git/web-trabalho

Servidor da UFSC: http://webtrabalho.victor.valle.vms.ufsc.br/

Além da hospedagem no servidor da UFSC, disponibilizamos o sistema no link: https://order-easy.netlify.app/ no qual o frontend está no servidor da netlify, backend no servidor da render e o banco de dados na MongoDB Atlas. Você pode entrar com o usuário 20103689 e senha 123.

Netlify: https://www.netlify.com/

Render: https://render.com/

MongoDB Atlas: https://www.mongodb.com/atlas/database

Para iniciar o projeto localmente siga os 4 passos abaixo:

1 - Tenha o node, npm e mongodb instalados previamente, caso não possua, disponibilizamos um passo a passo para instalá-los, você pode acessar pelo arquivo "Instalacao-Node-e-MongoDB.txt"

2 - Crie um arquivo .env na pasta frontend e outro na pasta backend para adicionar as variáveis de ambiente como segue:

2.1 - Variáveis de ambiente do Backend:

    # porta em que vai ser executado o backend, você pode escolher outra

    PORT=4000

    # nome do banco de dados

    DB_NAME="ORDER_EASY_DB"

    # pode ser qualquer outra sequência alfanumérica

    SECRET="4ENp4qSRxW3X7wxrsSWmIBu81GYgNWqPMg4Ff2dapEGhv8w31x"

2.2 - Variáveis de ambiente do Frontend:

    # pode ser qualquer outra sequência alfanumérica

    SECRET="EO2pFcouAlWw5VNcVvO02TRCNr6PW1frnDH5GF33m9I6G6mb1E"

    REACT_APP_VERSION=$npm_package_version

    # impede que terminal mostre erros do bold-ui

    GENERATE_SOURCEMAP=false

    # endereco do backend. Sempre colocar :XXXX no final, onde "XXXX" é o valor da variável de ambinete PORT no .env do backend (obs.: não colocar "/" no final)

    REACT_APP_URL_BACKEND=http://localhost:4000

3 - Execute este comando na raiz do projeto: chmod +x start-project.sh

4 - Execute ./start-project.sh na raiz do projeto para iniciar o sistema
