/* IMPORTACIONES */

const express = require('express')
const ejecutarAcciones = require('./test.js')

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))

/* MANEJO DE PRODUCTOS */
ejecutarAcciones()


/* RUTAS */
app.get('/api/sumar/:num1/:num2', (req, res) => {
    let suma = parseInt(req.params.num1) + parseInt(req.params.num2)
    res.send({suma})
})

app.get('/api/sumar', (req, res) => {
    const num1 = parseInt(req.query.num1);
    const num2 = parseInt(req.query.num2);
    const suma = num1 + num2;
    res.send(`La suma es: ${suma}`);
});

app.get('/api/operacion/:expresion', (req, res) => {
    const expresion = req.params.expresion;
    const resultado = eval(expresion);
    res.send(`El resultado de la operación es: ${resultado}`);
});


