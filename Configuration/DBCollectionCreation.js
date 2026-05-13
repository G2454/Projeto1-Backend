import {logError} from '../Utils/Logger.js';


async function createDatabase(client, databaseName){
    try{
        const db = client.db(databaseName);
        console.log(`The Database "${databaseName}" has been successfully created`);
        return db;
    } catch (error) {
        await logError('Error creating database', error, 'DB_CREATION');
        console.error("An error has occurred while creating the database: ", error);
        throw error;
    }
}

async function createCollection(db, collectionName){
   try {
    const collections = await db.listCollections().toArray(); 
    const collectionExists = collections.some(col => col.name === collectionName);

    if(collectionExists){
        console.log(`Collection "${collectionName}" already exists`);
        return db.collection(collectionName);
    }else{
        const newCollection = await db.createCollection(collectionName);
        console.log(`Collection "${collectionName}" has been created successfully`);
        return newCollection;
    }
   }catch (error) {
       await logError(`Error creating collection: ${collectionName}`, error, 'COLLECTION_CREATION');
       console.error("An error has occurred while creating the collection: ", error);
       throw error;
   }
}

export { createDatabase, createCollection };
