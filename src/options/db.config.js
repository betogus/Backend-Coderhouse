import dotenv from 'dotenv'
dotenv.config()

export const configMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'desafio10'
    }
}


export const configSqlite = {
    client: 'sqlite3',
    connection: {
        filename: './src/database/ecommerce/db.sqlite'
    },
    useNullAsDefault: true
}

export const configMongo = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/backend'
}

import admin from "firebase-admin";
import fs from 'fs'

const serviceAccount = JSON.parse(fs.readFileSync('./src/options/credentials.json', 'utf-8'))

export const configFirebase = {
    db: admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://coderback-e255e-default-rtdb.firebaseio.com"
    })
}


export const app = {
    persistence: process.env.PERSISTENCE
}

