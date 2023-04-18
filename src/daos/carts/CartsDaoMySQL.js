import ContenedorMySQL from "../../contenedores/ContenedorMySQL.js"
import { configMySQL } from "../../options/db.config.js"


export default class CartsDaoMySQL extends ContenedorMySQL {
    constructor() {
        super(configMySQL, 'Carts')
    }


}