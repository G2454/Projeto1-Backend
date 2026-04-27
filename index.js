import mongodb from 'mongodb';

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

let client, db, collection;

const DB_CLUSTER_HOST = "";//preencha com sua conection string do MongoDB Atlas;
const dataBaseName = "calendarDB";
const collectionName = "CalendarCollection";

async function initializeDatabase(){
    try{
        client = await connectToDatabase(DB_CLUSTER_HOST);
        db = await createDatabase(client, dataBaseName);
        collection = await createCollection(db, collectionName);
        console.log("Database initialization completed successfully");
        return { client, db, collection };
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

async function createSampleEntries(collection){
    try{
        await createEntry(collection, new event("Birthday Party", "2024-12-01", "São Paulo", "Birthday party with friends and family"));
        await createEntry(collection, new meeting("Project Meeting", "2024-11-15", "Google Meet", "Discuss project and deadlines"));
        await createEntry(collection, new task("Submit Report", "2024-10-30", "Complete and submit the report"));

        console.log("Sample entries created successfully");
    }catch (error) {
        console.error("Error creating sample entries:", error);
        throw error;
    }
}

async function deleteSampleEntries(collection){
    try{
        await removeEntry(collection, { name: "Birthday Party" });
        console.log("Sample entries deleted successfully");
    }catch (error) {
        console.error("Error deleting sample entries:", error);
        throw error;
    }
}

async function findOneEntry(collection){
    try{
        await findEntry(collection, { name: "Project Meeting" });
        console.log("Entry search completed successfully");
    }catch(error){
        console.error("Error finding entry:", error);
        throw error;
    }
}

function main(){
    //Criação do banco de dados e sua collection
    initializeDatabase()
    .then(({ collection }) => {
        //Criação dos dados de exemplo (Event, Meeting e Task))
        createSampleEntries(collection)
        //Busca de um dos dados criados
        .then(() => findOneEntry(collection))
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