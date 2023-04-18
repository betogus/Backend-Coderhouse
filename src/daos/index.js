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
