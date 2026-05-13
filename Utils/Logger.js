import { time } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../logs');

if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir, {recursive: true});
}

const getLogFilePath = () =>{
    const date = new Date().toISOString().split('T')[0];
    return path.join(logsDir, `errors-${date}.log`);
}

function formatError(message, error, context = ''){
    const timestamp = new Date().toISOString();
    const errorString = error instanceof Error ? error.stack : JSON.stringify(error);
    return `[${timestamp}] ${context ? `[${context}]` : ''}${message}\n${errorString}\n${'='.repeat(80)}`;
}

async function logError(message, error, context = ''){
    try{
        const logContent = formatError(message, error, context)
        const logFile = getLogFilePath();
        fs.appendFileSync(logFile, logContent, 'utf-8');
    }catch(error){
        console.log('Failed to write to log file', error);
    }
}

export{logError}