/* IMPORTACIONES */

const express = require('express')
const productRouter = require('./src/routes/productRouter.js')

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))
app.use(express.json())
app.use(express.static('public'))

/* MIDDLEWARES */


/* RUTAS */
app.use('/api/productos', productRouter)


app.get('/',  (req, res) => {
    res.sendFile(__dirname + "/src/public/product.html")
})


