import ApiPersistenceFactory from "../daos/productos/index.js";

class ApiService {
    constructor() {
        this.productDao
        this.#init()
    }

    #init = async () => {
        this.productDao = await ApiPersistenceFactory.getPersistence()
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

    getProductsByCategory = async (id) => {
        return await this.productDao.getByCategoryId(id)
    }

    deleteProduct = async(id) => {
        return await this.productDao.delete(id)
    }

    updateProduct = async(id, product) => {
        return await this.productDao.update(id, product)
    }
}

export const apiService = new ApiService()
