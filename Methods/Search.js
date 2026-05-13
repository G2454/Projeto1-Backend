import {logError} from '../Utils/Logger.js';

async function findEntry(collection, query){
    try{
        const result = await collection.findOne(query);
        if(result){
            console.log("Entry found successfully");
        } else {
            console.log("No entries found matching the criteria");
        }
        return result;
    }catch (error) {
        await logError('Error searching for entry', error, 'SEARCH_ENTRY');
        console.error("An error has occurred while searching for the entry: ", error);
        throw error;
    }
}
export { findEntry };