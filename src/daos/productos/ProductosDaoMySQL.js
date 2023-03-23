import ContenedorMySQL from "../../contenedores/ContenedorMySQL.js"
import { configMySQL } from "../../options/db.config.js"


export default class ProductosDaoMySQL extends ContenedorMySQL {
    constructor() {
        super(configMySQL, 'Products')
    }


}