import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "API Agenda Eletrônica",
        version: "1.0.0",
        description: "API para gerenciar eventos, reuniões e tarefas com autenticação de usuário"
    },
    servers: [
        { url: "http://localhost:3000/api", description: "Servidor Local" }
    ],
    components: {
        schemas: {
            Event: {
                type: "object",
                required: ["name", "date"],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    date: { type: "string", format: "date-time" },
                    location: { type: "string" },
                    description: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Meeting: {
                type: "object",
                required: ["name", "date"],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    date: { type: "string", format: "date-time" },
                    location: { type: "string" },
                    description: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Task: {
                type: "object",
                required: ["name", "dueDate"],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    dueDate: { type: "string", format: "date-time" },
                    description: { type: "string" },
                    completed: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            User: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    password: { type: "string" },
                    email: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                }
            }
        }
    },
    paths: {
        "/users/login": {
            post: {
                tags: ["Users"],
                summary: "Login de usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Login realizado com sucesso" },
                    400: { description: "Faltando credenciais" },
                    401: { description: "Credenciais inválidas" }
                }
            }
        },
        "/users/register": {
            post: {
                tags: ["Users"],
                summary: "Registrar novo usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    password: { type: "string" },
                                    email: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Usuário criado com sucesso" },
                    400: { description: "Erro ao criar usuário" }
                }
            }
        },
        "/users/logout": {
            post: {
                tags: ["Users"],
                summary: "Fazer logout",
                responses: {
                    200: { description: "Logout realizado com sucesso" }
                }
            }
        },
        "/events": {
            post: {
                tags: ["Events"],
                summary: "Criar novo evento",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Event" }
                        }
                    }
                },
                responses: {
                    201: { description: "Evento criado com sucesso" },
                    400: { description: "Erro de validação" },
                    401: { description: "Não autorizado" }
                }
            },
            get: {
                tags: ["Events"],
                summary: "Listar todos os eventos",
                responses: {
                    200: { description: "Lista de eventos" },
                    401: { description: "Não autorizado" }
                }
            }
        },
        "/events/{id}": {
            get: {
                tags: ["Events"],
                summary: "Obter evento por ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Evento encontrado" },
                    404: { description: "Evento não encontrado" }
                }
            },
            put: {
                tags: ["Events"],
                summary: "Atualizar evento",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Event" }
                        }
                    }
                },
                responses: {
                    200: { description: "Evento atualizado" },
                    400: { description: "Erro de validação" }
                }
            },
            delete: {
                tags: ["Events"],
                summary: "Deletar evento",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Evento deletado com sucesso" },
                    404: { description: "Evento não encontrado" }
                }
            }
        },
        "/meetings": {
            post: {
                tags: ["Meetings"],
                summary: "Criar nova reunião",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Meeting" }
                        }
                    }
                },
                responses: {
                    201: { description: "Reunião criada com sucesso" },
                    400: { description: "Erro de validação" },
                    401: { description: "Não autorizado" }
                }
            },
            get: {
                tags: ["Meetings"],
                summary: "Listar todas as reuniões",
                responses: {
                    200: { description: "Lista de reuniões" },
                    401: { description: "Não autorizado" }
                }
            }
        },
        "/meetings/{id}": {
            get: {
                tags: ["Meetings"],
                summary: "Obter reunião por ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Reunião encontrada" },
                    404: { description: "Reunião não encontrada" }
                }
            },
            put: {
                tags: ["Meetings"],
                summary: "Atualizar reunião",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Meeting" }
                        }
                    }
                },
                responses: {
                    200: { description: "Reunião atualizada" },
                    400: { description: "Erro de validação" }
                }
            },
            delete: {
                tags: ["Meetings"],
                summary: "Deletar reunião",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Reunião deletada com sucesso" },
                    404: { description: "Reunião não encontrada" }
                }
            }
        },
        "/tasks": {
            post: {
                tags: ["Tasks"],
                summary: "Criar nova tarefa",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                responses: {
                    201: { description: "Tarefa criada com sucesso" },
                    400: { description: "Erro de validação" },
                    401: { description: "Não autorizado" }
                }
            },
            get: {
                tags: ["Tasks"],
                summary: "Listar todas as tarefas",
                responses: {
                    200: { description: "Lista de tarefas" },
                    401: { description: "Não autorizado" }
                }
            }
        },
        "/tasks/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Obter tarefa por ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Tarefa encontrada" },
                    404: { description: "Tarefa não encontrada" }
                }
            },
            put: {
                tags: ["Tasks"],
                summary: "Atualizar tarefa",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                responses: {
                    200: { description: "Tarefa atualizada" },
                    400: { description: "Erro de validação" }
                }
            },
            delete: {
                tags: ["Tasks"],
                summary: "Deletar tarefa",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Tarefa deletada com sucesso" },
                    404: { description: "Tarefa não encontrada" }
                }
            }
        }
    }
};

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
