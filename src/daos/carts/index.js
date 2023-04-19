import { app } from '../../options/db.config.js'

export default class CartPersistenceFactory {
    static getPersistence = async () => {
        switch(app.cartPersistence) {
            case "FILE":
                let {default: CartsDaoFile} = await import('./CartsDaoFile.js')
                console.log("Persistencia del carrito: FILE")
                return new CartsDaoFile()
            case "MEMORY":
                let {default: CartsDaoMemory} = await import('./CartsDaoMemory.js')
                console.log("Persistencia del carrito: MEMORY")
                return new CartsDaoMemory() 
            case "FIREBASE":
                let {default: CartsDaoFirebase} = await import('./CartsDaoFirebase.js')
                console.log("Persistencia del carrito: FIREBASE")
                return new CartsDaoFirebase
        }
    }
}
