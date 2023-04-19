import { app } from '../../options/db.config.js'

export default class ApiPersistenceFactory {
    static getPersistence = async () => {
        switch(app.apiPersistence) {
            case "MONGO":
                let {default: ProductosDaoMongoDB} = await import('./ProductosDaoMongoDB.js')
                console.log("Persistencia de productos: MONGO")
                return new ProductosDaoMongoDB()
            case "FILE":
                let {default: ProductosDaoFile} = await import('./ProductosDaoFile.js')
                console.log("Persistencia de productos: FILE")
                return new ProductosDaoFile()
            case "MEMORY":
                let {default: ProductosDaoMemory} = await import('./ProductosDaoMemory.js')
                console.log("Persistencia de productos: MEMORY")
                return new ProductosDaoMemory() 
            case "MYSQL":
                let {default: ProductosDaoMySQL} = await import('./ProductosDaoMySQL.js')
                return new ProductosDaoMySQL
            case "FIREBASE":
                let {default: ProductosDaoFirebase} = await import('./ProductosDaoFirebase.js')
                console.log("Persistencia de productos: FIREBASE")
                return new ProductosDaoFirebase
        }
    }
}
