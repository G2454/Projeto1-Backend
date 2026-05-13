import {logError} from '../Utils/Logger.js';

async function removeEntry(collection, query){
    try{
        const result = await collection.deleteOne(query);
        if(result.deletedCount > 0){
            console.log("Entry removed successfully");
        } else {
            console.log("No entries found to delete");
        }
        return result;
    }catch (error) {
        await logError('Error removing entry', error, 'DELETE_ENTRY');
        console.error("An error has occurred while removing the entry:  ", error);
        throw error;
    }
}
export { removeEntry };