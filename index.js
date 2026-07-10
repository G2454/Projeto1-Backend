import { setServers } from 'node:dns';
import { connectToDatabase } from './src/Infrastructure/Database/mongoClient.js';
import { buildContainer } from './src/composition/container.js';
import { buildApp } from './src/app.js';

// Configuração DNS
setServers(["1.1.1.1", "8.8.8.8"]);

const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;

async function main() {
    let client;

    try {
        // Conectar ao MongoDB e inicializar as collections (Infrastructure)
        const connection = await connectToDatabase(MONGO_URI);
        client = connection.client;

        // Composition root: conecta repositórios -> services -> controllers -> routers
        const container = buildContainer(connection.collections);

        // Construir app Express
        const app = buildApp(container);

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API Docs: http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error("Fatal error:", error);
        if (client) await client.close();
        process.exit(1);
    }
}

main();