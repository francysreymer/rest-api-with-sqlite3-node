# API RESTful para Intervalos Mínimos e Máximos de Prêmios

Uma aplicação usando Node.js, TypeScript e SQLite3.

## Introdução

Esta API RESTful permite que você leia a lista de indicados e vencedores na categoria de Pior Filme do Golden Raspberry Awards.

## Índice

- [Instalação](#instalação)
- [Uso](#uso)

## Instalação

### Pré-requisitos

- [npm](https://www.npmjs.com/)

### Configuração

1. **Clone o repositório:**

    ```bash
    git clone git@github.com:francysreymer/rest-api-with-sqlite3-node.git
    cd rest-api-with-sqlite3-node
    ```

2. **Configure as variáveis de ambiente:**

    Dentro da pasta do projeto, copie o arquivo `.env.example` e renomeie-o para `.env`. Defina a variável `PORT` para o número da porta desejada ou deixe em branco para usar a porta padrão 3000.

3. **Coloque um arquivo CSV chamado `movielist.csv` dentro da pasta `/temp`.**

4. **Instale as dependências e inicie o servidor:**

    ```bash
    npm install
    npm start
    ```

5. **Execute os testes:**

    ```bash
    npm test
    ```

## Uso

- **Endpoint da API:** Acessível em [http://localhost:3000/api/movies/producers/award-intervals](http://localhost:3000/api/movies/producers/award-intervals).