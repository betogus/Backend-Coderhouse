import { app } from '../../options/db.config.js'

export default class ChatPersistenceFactory {
    static getPersistence = async () => {
        switch(app.chatPersistence) {
            case "FILE":
                let {default: ChatsDaoFile} = await import('./ChatsDaoFile.js')
                console.log("Persistencia de chats: FILE")
                return new ChatsDaoFile()
            case "MEMORY":
                let {default: ChatsDaoMemory} = await import('./ChatsDaoMemory.js')
                console.log("Persistencia de chats: MEMORY")
                return new ChatsDaoMemory() 
            case "MYSQL":
                let {default: ChatsDaoMySQL} = await import('./ChatsDaoMySQL.js')
                console.log("Persistencia de chats: MySQL")
                return new ChatsDaoMySQL()
        }
    }
}
