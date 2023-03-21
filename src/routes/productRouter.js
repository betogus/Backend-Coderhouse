/* IMPORTACIONES */
const express = require('express')
const router = express.Router()
const Contenedor = require('../models/Contenedor.js')
const multer = require('multer')
const {configMySQL} = require('../options/db.config.js')

/* CONFIGURACIONES DE LA BASE DE DATOS */

const contenedor = new Contenedor(configMySQL, "products")


/* ADMIN */

let isAdmin = true

/* MIDDLEWARES */

const validarId = (req, res, next) => {
    let {id} = req.params
    if (isNaN(id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method}`}) //CORREGIR
    next()
}

const noEmptyFields = (req, res, next) => {
    /* let producto = req.body
    let thumbnail = req.file
    if (!producto.title || !producto.price || !thumbnail) return res.status(400).send({
        error: "Hay campos vacíos"
    }) */
    next()
}

const validarProducto = (req, res, next) => {
    //let producto = req.body
    //if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock) return res.status(400).send({err: 'Faltan datos'})
    next()
}

const validarAdmin = (req, res, next) => {
    if (!isAdmin) return res.status(401).send({error: -1, descripcion: `ruta: ${req.baseUrl}${req.url} metodo: ${req.method} no autorizado`})
    next()
}


/* RUTAS */
router.get('/', async (req, res) => {
   /*  let productos;
    productos = await contenedor.getAll()
    .then(result => productos = result)
    .catch(err => res.send({error: 0, descripcion: err})) */
    res.status(200).render('dashboard')
})

router.get('/:id', validarId, async (req, res) => {
    let { id } = req.params
    await contenedor.getById(parseInt(id))
    .then(result => res.status(200).send(result))
    .catch(err => res.send({error: 0, descripcion: err}))
  
})

router.post('/', noEmptyFields, validarProducto, validarAdmin, async (req, res) => {
    let producto = req.body
    //producto.thumbnail = req.file.filename
    /* await contenedor.insertData(producto)
    .then(result => res.status(200).send(result))
    .catch(err => res.send({error: 0, descripcion: err})) */
})

router.put('/:id', noEmptyFields, validarAdmin, async (req, res) => {
    let { id } = req.params
    let producto = req.body
    await contenedor.modifyById(parseInt(id), producto)
    .then(result => res.status(200).send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})

router.delete('/:id', validarAdmin, async (req, res) => {
    let { id } = req.params
    await contenedor.deleteById(parseInt(id))
    .then(res.status(200).send({message: "Producto eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))
})

module.exports = router