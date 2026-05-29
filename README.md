# API de Calendário Eletrônico - Backend (Node.js, MongoDB, Express)

## 1. Equipe

* GUILHERME YUUKI SUMITA
  
## 2. Objetivo do Sistema

API REST para gerenciar um calendário eletrônico com autenticação de usuários e controle de sessão. O sistema permite o gerenciamento de:
1. **Eventos** - Criar, atualizar, deletar e listar eventos
2. **Reuniões** - Gerenciar reuniões com data, local e descrição
3. **Tarefas** - Criar tarefas com prazos e status de conclusão
4. **Usuários** - Registro, autenticação e gerenciamento de sessões

## 3. Funcionalidades Implementadas 

### Arquitetura e Padrões
* Domain-Driven Design (DDD) - Separação em camadas (Domain, API, Infrastructure)
* Repository Pattern - Abstração do banco de dados via repositórios
* Use Cases - Lógica de negócio isolada em classes de caso de uso
* Express.js - Framework para criação de rotas HTTP
* Express-Session - Gerenciamento de sessões de usuário
* Bcrypt - Hash seguro de senhas

### Funcionalidades de Negócio
* Autenticação - Registro e login de usuários com armazenamento seguro de senhas
* Controle de Acesso - Middleware `requireLogin` para proteger rotas
* CRUD Eventos - Criar, ler, atualizar e deletar eventos
* CRUD Reuniões - Gerenciar reuniões
* CRUD Tarefas - Gerenciar tarefas com status de conclusão
* Validações - Validação de dados de entrada nas entidades
* Documentação API - Swagger/OpenAPI para documentação das rotas
* Tratamento de Erros - Middleware global de erro com mensagens apropriadas

### Desenvolvimento
* Nodemon - Recarregamento automático durante desenvolvimento
* MongoDB Integration - Conexão e gerenciamento de coleções

## 4. Para Compilar e Executar o Sistema

### Ferramentas e Tecnologias Utilizadas

* **Linguagem / Ambiente de Execução:** Node.js v25.0.0, [(Download)](https://nodejs.org/pt/download/current).
* **IDE Recomendada:** Visual Studio Code, [(Download)](https://code.visualstudio.com/).
* **Banco de Dados:** MongoDB, [(Acessar)](https://www.mongodb.com/).
* **Framework Web:** Express.js v5.2.1
* **Autenticação:** Express-Session v1.19.0, Bcrypt v6.0.0
* **Documentação:** Swagger UI Express v5.0.1


### Roteiro para Executar a Aplicação

1.  Clone o repositório: `git clone https://github.com/G2454/Projeto1-Backend.git`
2.  Acesse a pasta do projeto
3.  Execute `npm install` para instalar as dependências
4.  Configure a variável de ambiente com sua connection string do MongoDB (linha 9 em `index.js`)
5.  Execute `npm run dev` para iniciar o servidor em modo desenvolvimento
6.  A API estará disponível em `http://localhost:3000`
7.  Acesse a documentação Swagger em `http://localhost:3000/api-docs`

## 5. Para Testar o Sistema

### Fluxo de Teste Recomendado

1. **Registro de Usuário:**
   - POST `/api/users/register` com `{ username, password, email }`

2. **Login:**
   - POST `/api/users/login` com `{ username, password }`
   - Sessão criada automaticamente

3. **Criar Evento/Reunião/Tarefa:**
   - POST `/api/events`, `/api/meetings`, `/api/tasks` com dados respectivos
   - Requer autenticação (sessão ativa)

4. **Listar, Atualizar e Deletar:**
   - GET/PUT/DELETE nas rotas correspondentes

### Usando o Swagger

- Acesse `http://localhost:3000/api-docs` para visualizar e testar todas as rotas interativamente
- O Swagger permite validar requisições e respostas em tempo real






