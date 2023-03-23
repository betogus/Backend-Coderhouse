import PersistenceFactory from "../daos/index.js";

export default class ProductService {
    constructor() {
        this.productDao
        this.#init()
    }

    #init = async () => {
        this.productDao = await PersistenceFactory.getPersistence()
    }

    addProduct = async (product) => {
        return await this.productDao.add(product)
    }

    getProducts = async () => {
        return await this.productDao.getAll()
    }

    getProductById = async (id) => {
        return await this.productDao.getById(id)
    }

    deleteProduct = async(id) => {
        return await this.productDao.delete(id)
    }

    updateProduct = async(id, product) => {
        return await this.productDao.update(id, product)
    }
}

