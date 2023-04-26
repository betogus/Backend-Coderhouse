import ChatPersistenceFactory from "../daos/chats/index.js";


class ChatService {
    constructor() {
        this.chatDao
        this.#init()
    }

    #init = async () => {
        this.chatDao = await ChatPersistenceFactory.getPersistence()
    }

    addChat = async (chat) => {
        return await this.chatDao.add(chat)
    }

    getAll = async () => {
        return await this.chatDao.getAll()
    }
}

export const chatService = new ChatService()