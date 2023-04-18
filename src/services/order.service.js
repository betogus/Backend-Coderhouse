import PersistenceFactory from "../daos/index.js";

class OrderService {
    constructor() {
        this.orderDao
        this.#init()
    }

    #init = async () => {
        this.orderDao = await PersistenceFactory.getPersistence()
    }

    addOrder = async (order) => {
        return await this.orderDao.add(order)
    }

    gerOrders = async () => {
        return await this.orderDao.getAll()
    }

    getOrdersByUsername = async (username) => {
        return await this.orderDao.getByUsername(username)
    }

    deleteOrder = async (id) => {
        return await this.orderDao.delete(id)
    }

}

export const orderService = new OrderService()
