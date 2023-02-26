/* IMPORTACIONES */

const express = require('express')
const productRouter = require('./src/routes/productRouter.js')
const handlebars = require('express-handlebars')

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))
app.use(express.json())
app.use(express.static('public'))
app.use('/uploads', express.static('src/database/uploads'))

/* MOTORES DE PLANTILLAS */

//Handlebars

app.engine('handlebars', handlebars.engine()) //establecemos la configuracion de handlebars
app.set('views', './src/public/views/handlebars') //establecemos el directorio donde se encuentran los archivos de plantilla
app.set('view engine', 'handlebars') //establecemos el motor de plantilla que se utiliza

//Pug

//app.set('view engine', 'pug')
//app.set('views', './src/public/views/pug')

//Ejs

app.set('view engine', 'ejs')
app.set('views', './src/public/views/ejs')

/* RUTAS */
app.use('/api/productos', productRouter)


app.get('/',  (req, res) => {
    res.sendFile(__dirname + "/src/public/product.html")
})


