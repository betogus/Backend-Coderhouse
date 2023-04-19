import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

export default class ProductosDaoFile extends ContenedorArchivo {
    constructor() {
        super('./public/database/archivos/productos.json')
    }
}