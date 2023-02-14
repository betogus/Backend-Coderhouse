const Contenedor = require("./contenedor.js") 
const contenedor = new Contenedor('./productos.json')

let product1 = {
    title: 'Escuadra',
    price: 123.45,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'
}

let product2 = {
    title: 'Tijera'
}

let product3 = {
    price: 123.67
}

let product4 = {
    title: 'Calculadora',
    price: 234.56,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
}

let product5 = {
    title: 'Globo Terráqueo',
    price: 345.67,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
}

const ejecutarAcciones = () => {
     //contenedor.save(product1).then(result => console.log(result))
     //contenedor.save(product2).then(result => console.log(result))
     //contenedor.save(product3).then(result => console.log(result))
     //contenedor.save(product4).then(result => console.log(result))

     //contenedor.getAll().then(result => console.log(result))
     //contenedor.getById(2).then(result => console.log(result))
     //contenedor.deleteById(2).then(result => console.log(result))
     //contenedor.deleteAll().then(result=>console.log(result))
}

module.exports = ejecutarAcciones