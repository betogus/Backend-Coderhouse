/* IMPORTACIONES */
const express = require('express')
const router = express.Router()
const Contenedor = require('../models/Contenedor.js')
const ruta = 'src/database/archivo.json'
const multer = require('multer')

/* MANEJO DE PRODUCTOS */
const contenedor = new Contenedor(ruta)

/* MIDDLEWARES */

const noEmptyFields = (req, res, next) => {
    let producto = req.body
    let thumbnail = req.file
    if (!producto.title || !producto.price || !thumbnail) return res.status(400).send({error: "Hay campos vacíos"})
    next()
}


/* MULTER */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/database/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

router.use(multer({storage}).single('thumbnail'))

/* RUTAS */
router.get('/', async (req, res) => {
    let productos;
    await contenedor.getAll().then(result => productos = result)
    res.send(productos)
})

router.get('/:id', async (req, res) => {
    let {id} = req.params
    let producto;
    await contenedor.getById(parseInt(id)).then(result => producto = result)
    res.send(producto)
})

router.post('/', noEmptyFields, async (req, res) => {
    let producto = req.body
    producto.thumbnail = req.file.filename
    let mensaje;
    await contenedor.save(producto).then(result => mensaje = result)
    res.send(mensaje)
})

router.put('/:id', noEmptyFields, async (req, res) => {
    let {id} = req.params
    let producto = req.body
    let mensaje;
    await contenedor.modifyById(parseInt(id), producto).then(result => mensaje = result)
    res.send(mensaje)
})

router.delete('/:id', async (req, res) => {
    let {id} = req.params
    let mensaje;
    await contenedor.deleteById(parseInt(id)).then(result => mensaje = result)
    res.send(mensaje)
})

module.exports = router