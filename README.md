
> > Instalamos mongoose (npm i mongoose) y dotenv. Creamos el archivo .env en la raiz, y agregamos una variable MONGO_URL la cual la obtenemos desde mongo atlass yendo a database, connect, connect your application y copiamos el código. El mismo lo pegamos en la variable MONGO_URL reemplazando donde dice password por coderuser, y agregando tambien donde dice backend.

```
MONGO_URL = mongodb+srv://coderuser:coderuser@codercluster.62a8h8r.mongodb.net/backend?retryWrites=true&w=majority
```

> > Organizamos las carpetas creando una llamada "contenedores" donde se encuentran las clases de cada uno de los métodos de persistencia (en archivo, en memoria, MySQL, MongoDB y Firebase). Por ejemplo, en el ContenedorMongoDB:

```
import mongoose from 'mongoose'

mongoose.set("strictQuery", false); //Ésto es por una incopatibilidad de versiones

export default class ContenedorMongoDB {
    constructor(model, config) {
        this.model = model
        this.mongoose = mongoose.connect(config.url)
            .then(() => {
                console.log("Conectado a la base de datos de mongo")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    add = async (data) => {
        try {
            await this.model.create(data)
            return {message: "Se agregó con éxito"}
        } catch (err) {
            return {
                err
            }
        }
    }

    getAll = async () => {
        let datas = await this.model.find({})
        if (datas.length === 0) return {
            message: "No hay datos"
        }
        return datas
    }

    getById = async (id) => {
        try {
            let data = await this.model.findOne({_id: id})
            if (!data) return { message: "No hubo coincidencias" }
            return data
        } catch (err) {
            return { message: "No hubo coincidencias" }
        }

    }

    delete = async (id) => {
        try {
            await this.model.deleteOne({_id: id})
            return {message: "Se eliminó con éxito"}
        } catch (err) {
            return {message: "No hubo coincidencias"}
        }
    }
    update = async (id, item) => {
        try {
            await this.model.findByIdAndUpdate(id, { $set: {...item} }, { new: true })
            return { message: "Dato actualizado con éxito"  }
        } catch (err) {
            return { message: "No hubo coincidencias" }
        }
    }
}
```

> > Creamos la carpeta daos donde creamos las clases que se extienden de la de los contenedores, con la diferencia de que le pasamos los parámetros del constructor y serán clases que dependen si es para utilizar en el carrito o en productos. Ejemplo, ProductosDaoMongoDB:

```
import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js"
import { ProductModel } from "../../models/MongoDBModel.js"
import { configMongo } from "../../options/db.config.js"

export default class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super(ProductModel, configMongo)
    }
}
```

> > Creamos un index dentro de daos para switchear entre las distintas bases de datos según la variable "app".

```
import { app } from '../options/db.config.js'

export default class PersistenceFactory {
    static getPersistence = async () => {
        switch(app.persistence) {
            case "MONGO":
                let {default: ProductosDaoMongoDB} = await import('../daos/productos/ProductosDaoMongoDB.js')
                return new ProductosDaoMongoDB()
            case "FILE":
                let {default: ProductosDaoArchivo} = await import('../daos/productos/ProductosDaoArchivo.js')
                return new ProductosDaoArchivo()
            case "MEMORY":
                let {default: ProductosDaoMemoria} = await import('../daos/productos/ProductosDaoMemoria.js')
                return new ProductosDaoMemoria() 
        }
    }
}
```

> > En options/db.config.js tendremos la variable app (entre otras configuraciones) la cual me define la base de datos a utilizar según la variable de entorno

```
import dotenv from 'dotenv'

dotenv.config()

export const configMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'pruebamysql'
    }
}

export const configSqlite = {
    client: 'sqlite3',
    connection: {
        filename: './src/database/ecommerce/db.sqlite'
    },
    useNullAsDefault: true
}

export const configMongo = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/backend'
}

export const app = {
    persistence: process.env.PERSISTENCE
}

```
> > Si no se conecta Mongo a través de MONGO_URL, debemos levantar nuestro servidor. En el CMD ejecutamos como administrador el siguiente comando

```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos”
```

> > En services, tendremos el ProductService y el CartService los cuales crean los métodos que se utilizarán en el router

```
import PersistenceFactory from "../daos/index.js";

export default class ProductService {
    constructor() {
        this.productDao
        this.#init()
    }

    #init = async () => {
        this.productDao = await PersistenceFactory.getPersistence()
    }

    addProduct = async (product) => {
        return await this.productDao.add(product)
    }

    getProducts = async () => {
        return await this.productDao.getAll()
    }

    getProductById = async (id) => {
        return await this.productDao.getById(id)
    }

    deleteProduct = async(id) => {
        return await this.productDao.delete(id)
    }

    updateProduct = async(id, product) => {
        return await this.productDao.update(id, product)
    }
}
```

> > Finalmente en routes tendremos el productRouter (para el caso de mongo, recordar que la base de datos y la tabla Products se crea una vez hayamos insertado un producto).

 ```
 import { Router } from "express";
import ProductService from "../services/ProductService.js";


const router = Router()
const productManager = new ProductService()


router.get('/', async (req, res) => {
    let result = await productManager.getProducts()
    res.send(result)
}) 

router.post('/', async (req, res) => {
    let product = req.body
    if (!product.title || !product.thumbnail || !product.price) {
        res.send({message: "Hay campos vacíos"})
    } else {
        let result = await productManager.addProduct(product)
        res.send(result)
    }
})

export default router
 ```

 > > Ahora implementaremos Firestore. npm i firebase-admin. . Creamos un proyecto en la pagina. Creamos una base de datos desde firestore database y elegimos el modo de prueba.
Vamos a la ruedita, vamos a cuenta de servicio, seleccionamos node js y copiamos ese codigo. Generamos la clave privada y movemos ese archivo que se descarga a la carpeta options y lo renombramos como credentials.json. En db.config.js:

```
import admin from "firebase-admin";
import fs from 'fs'

const serviceAccount = JSON.parse(fs.readFileSync('./src/options/credentials.json', 'utf-8'))

export const configFirebase = {
    db: admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://desafio10-cd04e-default-rtdb.firebaseio.com"
    })
}
```

> > ContenedorFirebase.js

```
export default class ContenedorFirebase {
    constructor(collection, config) {
        this.collection = collection
        this.db = config.firestore()
    }

    async getAll() {
        if (!this.collection) return {message: "No existe la BD"}
        const datas = await this.db.collection(this.collection).get()
        if (datas.length === 0) return {message: "No hay datos"}
        return datas.docs.map(doc => ({...doc.data(), id: doc.id}))
    }

    async getById(id) {
        if (!this.collection) return {message: "No existe la BD"}
        const data = await this.db.collection(this.collection).doc(id).get()
        if (!data) return {message: "No hay datos"}
        return {...data.data(), id:data.id}
    }

    async add(item) {
        try {
            let timestamp = new Date().toLocaleString()
            const data = JSON.parse(JSON.stringify(item))
            const datas = this.db.collection(this.collection)
            await datas.add({...data, timestamp})
            return {...data, timestamp}
        } catch (err) {
            return {message: err}
        }
    }

    async update(id, item) {
        if (!this.collection) return {message: "No existe la BD"}
        let timestamp = new Date().toLocaleString()
        const data = this.db.collection(this.collection).doc(id)
        if (!data) return {message: "No hay datos"}
        else {
            await data.update(JSON.parse(JSON.stringify({...item, timestamp})))
            return { message: 'Se actualizó con éxito'}
        }
    }

    async delete(id) {
        const doc = this.db.collection(this.collection).doc(id)
        const result = await doc.get()
        if (result.exists) {
            await doc.delete()
            return { message: "Se eliminó con éxito" }
        } else return { message: 'Dato no encontrado' }
    }
}
```

> > daos/productos/ProductosDaoFirebase.js

```
import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";
import { configFirebase } from "../../options/db.config.js";

export default class ProductosDaoFirebase extends ContenedorFirebase {
    constructor() {
        super("Products", configFirebase.db)
    }
}
```

> > daos/index.js

```
import { app } from '../options/db.config.js'

export default class PersistenceFactory {
    static getPersistence = async () => {
        console.log(app) 
        switch(app.persistence) {
            case "MONGO":
                let {default: ProductosDaoMongoDB} = await import('../daos/productos/ProductosDaoMongoDB.js')
                return new ProductosDaoMongoDB()
            case "FILE":
                let {default: ProductosDaoArchivo} = await import('../daos/productos/ProductosDaoArchivo.js')
                return new ProductosDaoArchivo()
            case "MEMORY":
                let {default: ProductosDaoMemoria} = await import('../daos/productos/ProductosDaoMemoria.js')
                return new ProductosDaoMemoria() 
            case "MYSQL":
                let {default: ProductosDaoMySQL} = await import('../daos/productos/ProductosDaoMySQL.js')
                return new ProductosDaoMySQL
            case "FIREBASE":
                let {default: ProductosDaoFirebase} = await import('../daos/productos/ProductosDaoFirebase.js')
                return new ProductosDaoFirebase
        }
    }
}

```
