import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";
import { configFirebase } from "../../options/db.config.js";

export default class CartsDaoFirebase extends ContenedorFirebase {
    constructor() {
        super("Carts", configFirebase.db)
    }
}