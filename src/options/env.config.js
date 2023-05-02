import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV+ '.env')
})

export default {
    NODE_ENV: process.env.NODE_ENV || "dev",
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 8080,
    API_PERSISTENCE: process.env.API_PERSISTENCE || "MEMORY",
    CART_PERSISTENCE: process.env.CART_PERSISTENCE || "MEMORY",
    CHAT_PERSISTENCE: process.env.CHAT_PERSISTENCE || "MEMORY",
    MODO: process.env.MODO || "fork"
}