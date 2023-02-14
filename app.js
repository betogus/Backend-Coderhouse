/* IMPORTACIONES */

const express = require('express')
const Contenedor = require('./Contenedor.js')

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))

/* MANEJO DE PRODUCTOS */
const contenedor = new Contenedor('productos.txt')


/* RUTAS */
app.get('/productos', async (req, res) => {
    let productos;
    await contenedor.getAll().then(result => productos = result)
    console.log(productos)
    res.send(productos)
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.get('/productoRandom', async (request, response) => {
    let productos;
    await contenedor.getAll().then(result => productos = result)
    response.send(productos[getRandomInt(3)])
})


