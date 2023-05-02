/* IMPORTACIONES */
import express from 'express'
import { Server } from 'socket.io'
import productRouter from './routes/productRouter.js'
import multer from 'multer'
import authRouter from './routes/authRouter.js'
import handlebars from 'express-handlebars'
import session from "express-session";
import cookieParser from "cookie-parser";
import { initializePassport } from './options/strategies/passport.config.js'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import googleStrategy from './options/strategies/google.js'
import { PORT, MODO } from './yargs.cjs'
import apiRouter from './routes/apiRouter.js'
import os from 'os'
import cluster from 'cluster'
import userRouter from './routes/userRouter.js'
import cartRouter from './routes/cartRouter.js'
import chatRouter from './routes/chatRouter.js'
import { logger } from './winston.js'
import orderRouter from './routes/orderRouter.js'
import configRouter from './routes/configRouter.js'
import config from './options/env.config.js'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { chatService } from './services/chat.service.js'
import sharedSession from 'express-socket.io-session'
import compression from 'compression'
import dotenv from 'dotenv'
/* CONFIGURACION */
dotenv.config()
const app = express()
let modo = MODO;
if (config.NODE_ENV=="dev") app.use(cors())
else {
    app.use(compression())
    modo = "cluster"
}

const NUM_CPUS = os.cpus().length
let puerto = PORT || config.PORT;
if (modo === "cluster" && cluster.isPrimary) {
    logger.info("Iniciando en modo cluster")
    logger.info(`Proceso principal ${process.pid} está corriendo`)
    for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Proceso ${worker.process.pid} murió`)
    })
} else {
    let server = app.listen(puerto, () => {
        logger.info(`Iniciando servidor en puerto ${puerto}`)
        logger.info(`${config.NODE_ENV}`)
    })

    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(express.static('public'))
    app.use('/uploads', express.static('./public/database/uploads'))
    app.engine('handlebars', handlebars.engine())
    app.set('views', './public/views')
    
    app.set('view engine', 'handlebars')
    app.set('view engine', 'pug');
    app.set('view engine', 'ejs');

    /* SWAGGER */
    const swaggerSpec = {
        definition: {
            openapi: '3.0.0', //es la versión de las especificaciones que usaremos
            info: {
                title: 'My Awesome API Documentation',
                version: '1.0.0'
            },
            servers: [{
                url: 'http://localhost:8080'
            }]
        },
        apis: ["./src/docs/**/*.yaml"]
    }

    app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)))
    app.use(cookieParser())

    /* MULTER */
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/database/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    app.use(multer({ storage }).single('photo'))
    let maxAge = parseInt(process.env.MAX_AGE) || 60000; 
    let middlewareSession = session({
        store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/backendSession'}),
        secret: 'c0d3r',
        resave: true,
        cookie: {maxAge: maxAge},
        saveUninitialized: true
    })

    app.use(middlewareSession)

    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(googleStrategy)

  



    /* RUTAS */
    app.use('/dashboard', productRouter)
    app.use('/auth', authRouter)
    app.use('/products', apiRouter)
    app.use('/user', userRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.use('/chat', chatRouter)
    app.use('/config', configRouter)
    app.get('/', (req, res) => {
        res.redirect('/dashboard')
    })

    app.get('/info', (req, res) => {
        let info = {
            argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
            plataforma: process.platform,
            versionNodeJs: process.version,
            memoriaUsada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesos: os.cpus().length
        }
        res.render('info', {
            info
        })
    })

    //RUTAS NO DEFINIDAS

    app.use((req, res) => {
        logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
        res.status(404).send("Ruta no encontrada");

    });

    /* WEBSOCKET */

    const io = new Server(server)

  

    // Configurar middleware de sesión compartida para socket.io
    io.use(sharedSession(middlewareSession))
   
    io.on('connection', async socket => {
        let user = {username: socket.handshake.cookies.user?.username, photo: socket.handshake.cookies.user?.photo}
        let chat = await chatService.getAll()
        socket.emit('history', {chat, user}) 
        
        socket.on('message', async data => {
            let newData = data 
            let timestamp = new Date().toLocaleString() 
            newData.timestamp = timestamp
            await chatService.addChat(data)  
            io.emit('newMessage', newData)
        })
        
    })



}

  