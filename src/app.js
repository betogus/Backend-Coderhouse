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
import { logger } from './winston.js'
import orderRouter from './routes/orderRouter.js'

/* CONFIGURACION */
const app = express()
const NUM_CPUS = os.cpus().length
let puerto = PORT || 8080;
if (MODO === "cluster" && cluster.isPrimary) {
    console.log(`Proceso principal ${process.pid} está corriendo`)
    for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Proceso ${worker.process.pid} murió`)
    })
} else {
    app.listen(puerto, () => {
        console.log(`Iniciando servidor en puerto ${puerto}`)
    })

    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(express.static('public'))
    app.use('/uploads', express.static('./public/database/uploads'))
    app.engine('handlebars', handlebars.engine())
    app.set('views', './public/views/handlebars')
    app.set('view engine', 'handlebars')

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

    app.use(session({
        store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/backendSession'}),
        secret: 'c0d3r',
        resave: true,
        cookie: {maxAge: 60000},
        saveUninitialized: true
    }))

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
}