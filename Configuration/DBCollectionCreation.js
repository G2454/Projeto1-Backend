async function createDatabase(client, databaseName){
    try{
        const db = client.db(databaseName);
        console.log(`The Database "${databaseName}" has been successfully created`);
        return db;
    } catch (error) {
        console.error("An error has occurred while creating the database: ", error);
        throw error;
    }
}

async function createCollection(db, collectionName){
   try {
    const collections = await db.listCollections().toArray(); 
    return db.collection(collectionName);
   }catch (error) {
       console.error("An error has occurred while creating the collection: ", error);
       throw error;
   }
}

export { createDatabase, createCollection };
