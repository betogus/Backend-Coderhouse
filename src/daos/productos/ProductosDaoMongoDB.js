import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js"
import { ProductModel } from "../../models/MongoDBModel.js"
import { configMongo } from "../../options/db.config.js"

export default class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super(ProductModel/*, configMongo  */)
    }
}