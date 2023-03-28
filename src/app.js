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
import yargs from './yargs.cjs'
import apiRouter from './routes/apiRouther.js'

/* CONFIGURACION */
const app = express()
const args = yargs.parse();
const port = args.port || 8080;
const server = app.listen(port, () => console.log('Server Up at port ', port))
const io = new Server(server)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('src/database/uploads'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/public/views/handlebars')
app.set('view engine', 'handlebars')

app.use(cookieParser())

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
/* MULTER */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/database/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
app.use(multer({ storage }).single('thumbnail'))


/* RUTAS */
app.use('/products', productRouter)
app.use('/auth', authRouter)
app.use('/api/randoms', apiRouter)

app.get('/', (req, res) => {
    res.redirect('/products')
})

app.get('/info', (req, res) => {
    let info = {
        argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
        plataforma: process.platform,
        versionNodeJs: process.version,
        memoriaUsada: process.memoryUsage(),
        pathDeEjecucion: process.execPath,
        processId: process.pid,
        carpetaDelProyecto: process.cwd()
    }
    res.render('info', {
        info
    })
})