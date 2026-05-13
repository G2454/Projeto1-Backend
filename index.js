import mongodb from 'mongodb';
import { logError } from './Utils/Logger.js';

//Configuração de DNS por conta de erros na conexão com o MongoDB Atlas
import { setServers } from 'node:dns';
setServers(["1.1.1.1", "8.8.8.8"]);

import {createDatabase, createCollection} from './Configuration/DBCollectionCreation.js';
import { connectToDatabase } from './Configuration/DBConnectionConfiguration.js';
import { event } from './Models/event.js';
import { meeting } from './Models/meeting.js';
import { task } from './Models/task.js';
import { createEntry } from './Methods/Create.js';
import { findEntry } from './Methods/Search.js';
import { removeEntry } from './Methods/Delete.js';

let client, db, eventsCollection, meetingsCollection, tasksCollection;

const DB_CLUSTER_HOST = "mongodb+srv://guilherme_sumita:senha123@cluster0.u931lmp.mongodb.net/?appName=Cluster0";//preencha com sua conection string do MongoDB Atlas;
const dataBaseName = "calendarDB";
const eventsCollectionName = "events";
const meetingsCollectionName = "meetings";
const tasksCollectionName = "tasks";


async function initializeDatabase(){
    try{
        client = await connectToDatabase(DB_CLUSTER_HOST);
        db = await createDatabase(client, dataBaseName);
        eventsCollection = await createCollection(db, eventsCollectionName);
        meetingsCollection = await createCollection(db, meetingsCollectionName);
        tasksCollection = await createCollection(db, tasksCollectionName);
        console.log("Database initialization completed successfully");
        return { client, db, eventsCollection, meetingsCollection, tasksCollection  };
    } catch (error) {
        await logError('Error initializing database', error,'DATABASE_INIT');
        console.error("Error initializing database:", error);
        throw error;
    }
}

async function createSampleEntries(eventsCol, meetingsCol,tasksCol){
    try{
        const eventEntry = new event("Birthday Party", "2024-12-01", "São Paulo", "Birthday party with friends and family");
        await createEntry(eventsCol,eventEntry);

        const meetingEntry = new meeting("Project Meeting", "2024-11-15", "Google Meet", "Discuss project and deadlines");
        await createEntry(meetingsCol, meetingEntry);

        const taskEntry = new task("Submit Report", "2024-10-30", "Complete and submit the report");
        await createEntry(tasksCol,taskEntry );

        console.log("Sample entries created successfully");
    }catch (error) {
        await logError('Error creating sample entries', error, 'CREATE_SAMPLES');
        console.error("Error creating sample entries:", error);
        throw error;
    }
}

async function deleteSampleEntries(eventsCol){
    try{
        await removeEntry(eventsCol, { name: "Birthday Party" });
        console.log("Sample entries deleted successfully");
    }catch (error) {
        await logError('Error deleting sample entries', error, 'DELETE_SAMPLES');
        console.error("Error deleting sample entries:", error);
        throw error;
    }
}

async function findOneEntry(meetingsCol){
    try{
        await findEntry(meetingsCol, { name: "Project Meeting" });
        console.log("Entry search completed successfully");
    }catch(error){
        await logError('Error finding entry', error, 'FIND_ENTRY');
        console.error("Error finding entry:", error);
        throw error;
    }
}

function main(){
    //Criação do banco de dados e sua collection
    initializeDatabase()
    .then(({ eventsCollection, meetingsCollection, tasksCollection }) => {
        //Criação dos dados de exemplo (Event, Meeting e Task))
        return createSampleEntries(eventsCollection, meetingsCollection, tasksCollection)
        //Busca de um dos dados criados
        .then(() => findOneEntry(meetingsCollection))
        //Remoção de um dos dados criados - Comentado para evitar a remoção dos dados de exemplo
        //.then(() => deleteSampleEntries(collection))
        //Log de sucesso
        .then(() => console.log("All operations completed successfully"))
        //Fechamento da conexão
        .finally(() => client.close())
        .catch(error => console.error("Error in operations:", error));
    })
    .catch(error => console.error("Error initializing database:", error));
}

main();