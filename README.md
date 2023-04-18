# Desafio 20

## Mejorar la arquitectura de nuestra api


> Base de datos

> > Utilizamos mongoose. Ejecutamos como administrador la base de datos con el cmd


```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> Persistencia

> > Utilizaremos distintas bases de datos para almacenar las órdenes de compra. Éstes contendrán los datos del usuario (id, username), el timestamp y los productos. Los tipos de persistencia utilizados serán en archivo, en memoria y en firebase. En primer lugar, modificamos las clases ContenedorArchivo, ContenedorFirebase y ContenedorMemoria para incluirles el método getByUsername. Ej. en Firebase

```
async getByUsername(username) {
        if (!this.collection) return {message: "No existe la BD"}
        const querySnapshot = await this.db.collection(this.collection).where('username', "==", username).get()
        if (querySnapshot.empty) return { message: "No hay datos" }
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return data;
    }
```

> > Esta clase es utilizada en el CartsDaoFirebase

```
import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";
import { configFirebase } from "../../options/db.config.js";

export default class CartsDaoFirebase extends ContenedorFirebase {
    constructor() {
        super("Carts", configFirebase.db)
    }
}
```
> > Creamos el order.service el cual sólo dependerá del PersistenceFactory

```
import PersistenceFactory from "../daos/index.js";

class OrderService {
    constructor() {
        this.orderDao
        this.#init()
    }

    #init = async () => {
        this.orderDao = await PersistenceFactory.getPersistence()
    }

    addOrder = async (order) => {
        return await this.orderDao.add(order)
    }

    gerOrders = async () => {
        return await this.orderDao.getAll()
    }

    getOrdersByUsername = async (username) => {
        return await this.orderDao.getByUsername(username)
    }

    deleteOrder = async (id) => {
        return await this.orderDao.delete(id)
    }

}

export const orderService = new OrderService()

```

> > Dentro de la carpeta daos, tendremos un index en el cual aquí se definirá el tipo de persistencia de acuerdo a una variable definida en nuestro archivo .env


```
import { app } from '../options/db.config.js'

export default class PersistenceFactory {
    static getPersistence = async () => {
        switch(app.persistence) {
            case "MONGO":
                let {default: CartsDaoMongoDB} = await import('../daos/carts/CartsDaoMongoDB.js')
                console.log("Persistencia: MONGO")
                return new CartsDaoMongoDB()
            case "FILE":
                let {default: CartsDaoFile} = await import('../daos/carts/CartsDaoFile.js')
                console.log("Persistencia: FILE")
                return new CartsDaoFile()
            case "MEMORY":
                let {default: CartsDaoMemory} = await import('../daos/carts/CartsDaoMemory.js')
                console.log("Persistencia: MEMORY")
                return new CartsDaoMemory() 
            case "MYSQL":
                let {default: CartsDaoMySQL} = await import('../daos/carts/CartsDaoMySQL.js')
                return new CartsDaoMySQL
            case "FIREBASE":
                let {default: CartsDaoFirebase} = await import('../daos/carts/CartsDaoFirebase.js')
                console.log("Persistencia: FIREBASE")
                return new CartsDaoFirebase
        }
    }
}

``` 

> > Agregamos en el main.handlebars una nueva pestaña que será la de las órdenes de compras

```
<li class="header-nav-item"><a href="/order">Mis órdenes</a></li>
```

> > Creamos nuestro order.handlebars

```
<div class="container">
    <h1 id="titulo">Órdenes</h1>
    <div id="order-container">
        {{#if orders.length}}
        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            {{#each orders}}
            {{#each this.products}}
            <tr>
                <td>{{name}}</td>
                <td>{{price}}</td>
                <td>{{../timestamp}}</td>
            </tr>
            {{/each}}
            {{/each}}
        </table>
        {{else}}
        <h3>No hay órdenes</h3>
        {{/if}}
    </div>
</div>
```

> > En el cart.handlebars, modificamos el evento "click" de "confirmar compra", cambiando el fetch de "/cart" a "/order". A su vez, la lógica de respuesta a este fetch, se hará en el order.controller. Pero antes, debemos crear el OrderDto que es el que se encargará de enviarle al front sólo la info necesaria, que será el timestamp, nombre y precio de los productos, y el username.

```
export default class OrderDTO {
    constructor(order) {
        this.username = order.username,
        this.timestamp = order.timestamp,
        this.products = []
        this.addProduct(order)
    }

    addProduct(order) {
        if (order?.products?.length) {
            for (let i = 0; i < order.products.length; i++) {
                let product = order.products[i]
                this.products.push({name: product.name, price: product.precioKg})
            }
        }

    }
}
```
> > order.controller:

```
import OrderDTO from "../dtos/OrderDto.js"
import { enviarEmail } from "../middlewares/middlewares.js"
import { orderService } from "../services/order.service.js"

export const getOrderById = async (req, res) => {
    if (req.isAuthenticated()) {
        let {username} = req.session.user
        let orders = await orderService.getOrdersByUsername(username)
        let ordersDTO = []
        for (let i = 0; i < orders.length; i++) {
            let orderDTO = new OrderDTO(orders[i])
            ordersDTO.push({...orderDTO})
        } 
        res.render('order', {orders: ordersDTO})
    } else {
        res.redirect('/auth/login')
    }
    
}

export const postOrder = async (req, res) => {
    const userId = req.session.passport?.user;
    if (userId) {
        let products = req.body
        let order = {products, username: userId.username, id:userId._id}
        try {
            await orderService.addOrder(order)
            await enviarEmail(userId, products)
            res.status(200).send()
        } catch (err) {
            res.status(500).send()
        }
       
    } else {
        res.redirect('/auth/login')
    }
}
```

> > orderRouter:

```
import { Router } from "express";
import { getOrderById, postOrder } from "../controllers/order.controller.js";


const router = Router()

router.post('/', postOrder)
router.get('/', getOrderById)

export default router
```

> > app.js


```
app.use('/order', orderRouter)
```