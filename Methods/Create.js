import { logError } from "../Utils/Logger.js";

async function createEntry(collection, entry){
    try{
        if(entry.validate && typeof entry.validate === 'function'){
            entry.validate();
        }
        const result = await collection.insertOne(entry);
        console.log(`Entry created successfully (ID: ${result.insertedId})`);
        return result;
    }catch (error) {
        await logError('Error creating entry', error, 'CREATE_ENTRY');
        console.error("An error has occurred while creating the entry: ", error);
        throw error;
    }
}

export { createEntry };