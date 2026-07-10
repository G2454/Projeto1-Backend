import mongodb from 'mongodb';

const { MongoClient } = mongodb;

const DEFAULT_DB_NAME = "calendarDB";

async function initializeDatabase(client, dataBaseName) {
    const db = client.db(dataBaseName);

    // Cria as collections se ainda não existirem.
    const eventsCollection = await db.createCollection("events").catch(() => db.collection("events"));
    const meetingsCollection = await db.createCollection("meetings").catch(() => db.collection("meetings"));
    const tasksCollection = await db.createCollection("tasks").catch(() => db.collection("tasks"));
    const usersCollection = await db.createCollection("users").catch(() => db.collection("users"));

    console.log("Database initialized successfully");

    return { db, eventsCollection, meetingsCollection, tasksCollection, usersCollection };
}

/**
 * Conecta ao MongoDB e inicializa as collections.
 * Retorna o client (para fechamento em caso de erro) e as collections.
 */
export async function connectToDatabase(uri, dataBaseName = DEFAULT_DB_NAME) {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const collections = await initializeDatabase(client, dataBaseName);

    return { client, collections };
}
