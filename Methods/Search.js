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
        console.error("An error has occurred while searching for the entry: ", error);
        throw error;
    }
}


export { findEntry };