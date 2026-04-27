async function createEntry(collection, entry){
    try{
        const result = await collection.insertOne(entry);
        console.log(`Entry created successfully (ID: ${result.insertedId})`);
        return result;
    }catch (error) {
        console.error("An error has occurred while creating the entry: ", error);
        throw error;
    }
}

export { createEntry };