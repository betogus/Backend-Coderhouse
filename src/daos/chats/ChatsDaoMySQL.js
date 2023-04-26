import Mensajes from "../../models/Mensajes.js"
import { configMySQL } from "../../options/db.config.js"

export default class ChatsDaoMySQL extends Mensajes {
    constructor() {
        super(configMySQL,'chats')
    }

    
}

