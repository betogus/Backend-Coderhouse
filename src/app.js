/* IMPORTACIONES */
import express from 'express'
import { Server } from 'socket.io'
import productRouter from './routes/productRouter.js'
import multer from 'multer'



/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))
const io = new Server(server)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('src/database/uploads'))

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
