# API RESTful para Intervalos Mínimos e Máximos de Prêmios

Uma aplicação usando Node.js, TypeScript e SQLite3.

## Introdução

Esta API RESTful lê dados de um arquivo CSV e fornece informações sobre os produtores de filmes vencedores com o menor e o maior intervalo entre os prêmios. A API retorna os dados no seguinte formato JSON:

```JSON
{
   "min": [
        {
            "producer": "Joel Silver",
            "interval": 1,
            "previousWin": 1990,
            "followingWin": 1991
        }
    ],
    "max": [
        {
            "producer": "Matthew Vaughn",
            "interval": 13,
            "previousWin": 2002,
            "followingWin": 2015
        }
    ]
}
```

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
   - Já existe um arquivo com o mesmo nome (`movielist.csv`) contendo dados padrão. Este arquivo é utilizado como referência para os testes de integração.
   - Se você desejar testar com outros dados, o arquivo pode ser alterado. No entanto, um teste específico de integração deverá falhar, pois os resultados serão diferentes daqueles fornecidos pela API com os dados padrão.

![Integration Test Explanation](./assets/img/integration-test-explanation.png)

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