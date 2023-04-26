import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

export default class ChatsDaoFile extends ContenedorArchivo {
    constructor() {
        super('./public/database/archivos/chats.json')
    }
}

