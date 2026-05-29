import mongodb from 'mongodb';
import { setServers } from 'node:dns';
import { buildApp } from './src/app.js';

// Configuração DNS
setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient } = mongodb;
const DB_CLUSTER_HOST = "";
const dataBaseName = "calendarDB";
const PORT = process.env.PORT || 3000;

async function initializeDatabase(client) {
    try {
        const db = client.db(dataBaseName);
        
        // Criar collections se não existirem
        const eventsCollection = await db.createCollection("events").catch(() => db.collection("events"));
        const meetingsCollection = await db.createCollection("meetings").catch(() => db.collection("meetings"));
        const tasksCollection = await db.createCollection("tasks").catch(() => db.collection("tasks"));
        const usersCollection = await db.createCollection("users").catch(() => db.collection("users"));

        console.log("Database initialized successfully");
        
        return {
            db,
            eventsCollection,
            meetingsCollection,
            tasksCollection,
            usersCollection
        };
    } catch (error) {
        console.error('Error initializing database', error);
        throw error;
    }
}

async function main() {
    let client;
    
    try {
        // Conectar ao MongoDB
        client = new MongoClient(DB_CLUSTER_HOST);
        await client.connect();
        console.log("Connected to MongoDB");

        // Inicializar banco e collections
        const { db, eventsCollection, meetingsCollection, tasksCollection, usersCollection } = 
            await initializeDatabase(client);

        // Construir app Express
        const app = buildApp({
            eventsCollection,
            meetingsCollection,
            tasksCollection,
            usersCollection
        });

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API Docs: http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error("Fatal error:", error);
        if (client) await client.close();
        process.exit(1);
    }
}

main();

main();