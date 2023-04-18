import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js"
import { CartModel } from "../../models/MongoDBModel.js"
import { configMongo } from "../../options/db.config.js"

export default class CartsDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super(CartModel, configMongo)
    }
}