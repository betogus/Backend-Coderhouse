import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";
import { configFirebase } from "../../options/db.config.js";

export default class ProductosDaoFirebase extends ContenedorFirebase {
    constructor() {
        super("Products", configFirebase.db)
    }
}