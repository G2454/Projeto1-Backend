import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
let client;

async function connectToDatabase(mongoUri){
    client = new MongoClient(mongoUri);
    try{
        await client.connect();
        console.log("Database connection established successfully");
        return client;
    }catch(error){
        console.error("An error has occurred while connecting to the database: ", error);
        throw error;
    } 
}


async function disconnectDatabase(){
    try{
        if(client){
            await client.close();
            console.log(" Database connection closed");
        }
    }catch(error){
        console.error("✗ Disconnection error: ", error);
    }
}

export { connectToDatabase, disconnectDatabase };
