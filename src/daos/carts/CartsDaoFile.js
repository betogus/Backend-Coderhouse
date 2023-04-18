import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

export default class CartsDaoFile extends ContenedorArchivo {
    constructor() {
        super('./public/database/archivos/carts.json')
    }
}