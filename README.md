# Sistema de Calendário (Node JS, MongoDB)

## 1. Equipe

* GUILHERME YUUKI SUMITA
  
## 2. Objetivo do Sistema

O sistema tem como objetivo cadastrar, procurar e remover dados, sendo eles:
1. Eventos
2. Reuniões
3. Tarefas

## 3. Funcionalidades Desenvolvidas 

* Método para adicionar um novo dado
* Método para remover um novo dado
* Método para procurar um novo dado
  
## 4. Para Compilar e Executar o Sistema

### Ferramentas e Tecnologias Utilizadas

* **Linguagem / Ambiente de Execução:** Node.js v25.0.0, [(Download)](https://nodejs.org/pt/download/current).
* **IDE Recomendada:** Visual Studio Code, [(Download)](https://code.visualstudio.com/).
* **Banco de Dados:** MongoDB, [(Acessar)](https://www.mongodb.com/).


### Roteiro para Executar a Aplicação

1.  Clone o repositório: `git clone https://github.com/G2454/Projeto1-Backend.git`
2.  Acesse a pasta do projeto
3.  Na linha 18, insira a sua connection String fornecida pelo MongoDB
4.  Abra uma terminal integrado no arquivo index.js e digite `npm install`
5.  Posteriormente digite `npm start`

## 5. Para Testar o Sistema

### Roteiro de Teste (Fluxo de Uso)

1.  Na função Main (linha 68) no index.js, todas as funções já serão executadas, com exceção de deletar, que está comentada (linha 77)

### Próximos passos

1. Melhorar a arquitetura (Domain-Driven Design)
2. Implementar ferramentas, como Swagger, para permitir melhor documentação e testabilidade da aplicação
3. Testes unitários para cada um dos métodos (Jest)
4. Utilizar libs que permitam melhorar o desenvolvimento (Express, Nodemon)



