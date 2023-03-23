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
