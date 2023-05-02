import env from '../options/env.config.js';

export const getConfig = (req, res) => {
    let envData;
        envData = {
            CART_PERSISTENCE: env.CART_PERSISTENCE,
            API_PERSISTENCE: env.API_PERSISTENCE,
            CHAT_PERSISTENCE: env.CHAT_PERSISTENCE,
            NODE_ENV: env.NODE_ENV,
            PORT: env.PORT,
            HOST: env.HOST,
            MODO: env.MODO
        };

    res.render('config.pug', {
        env: envData
    });
};