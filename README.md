# Desafio 21

## Testeamos nuestra API REST


> Base de datos

> > Utilizamos mongoose. Ejecutamos como administrador la base de datos con el cmd


```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> AXIOS

> > Instalamos axios y creamos dentro de src una carpeta clienteHTTP con el archivo http.axios.local.js. El mismo lo ejecutamos descomentando el llamado a las funciones

```
import axios from "axios"
import generarProducto from "./generador.cjs"

/* GET  */
export const axiosGetProducts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/products')
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//axiosGetProducts()

/* POST */


//una manera:
/* let userRegister = {
    username: "Benja",
    address: "Calle falsa 123",
    age: 28,
    phone: "123123123",
    email: "gus@hotmail.com",
    password: "123"
} */

//otra manera:
let product = generarProducto()

export const axiosPostProduct = async () => {
    try {
        const response = await axios.post('http://localhost:8080/products', product)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//axiosPostProduct()


```

> > instalamos faker (npm i faker@5) y creamos el archivo generador.cjs

```
const faker = require('faker')

faker.locale = "es"

 const generarProducto = () => ({
    id: faker.datatype.number(),
    name: faker.commerce.productName(),
    precio100gr: faker.datatype.number({ min: 10, max: 50 }),
    precioKg: faker.datatype.number({ min: 150, max: 300 }),
    hayStock: faker.datatype.boolean(),
    categoryId: faker.datatype.number({ min: 1, max: 5 })
})

module.exports = generarProducto

```
> > Para aplicar CRUD sobre los productos, realizamos algo similar a lo que hicimos con el cart. Es decir, creamos un API_PERSISTENCE en el archivo .env, dentro de daos/products/index generamos la lógica de switch de acuerdo al tipo de persistencia seleccionado, creamos un api.service que utilizará ese persistenceFactory, creamos un api.controller para generar las funciones (req, res), creamos el apiRouter donde se encuentran las rútas y métodos de /productos, e incorporamos ese router al app.js. En el middleware,js agregamos una validación de los productos (validateProduct). 

> TEST

> > Instalamos mocha, chai y supertest (npm i -D mocha chai supertest). Agregamos en el package.json lo siguiente: "test": "mocha src/test/products.test.js". Creamos el archivo test/products.test.js

```
import supertest from 'supertest'
import { expect } from 'chai'
import generarProducto from '../clienteHttp/generador.cjs'

const request = supertest('http://localhost:8080/products')

describe('test Products', () => {
    describe('GET', () => {
        it('Debe verificar que no devuelva un array vacío', async () => {
            let producto = generarProducto()
            await request.post('/').send(producto)
            let res = await request.get('/')
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.not.empty;
        })
    })
})
describe('POST', () => {
    it('Verificamos que el producto se añadió con éxito si éste cumple con todos los campos', async () => {
        let producto = generarProducto()
        let res = await request.post('/').send(producto)
        expect(res.status).to.equal(201);

    })
})

```
