import  { apiService } from "../services/api.service.js"


export const getApi = async (req, res) => {
    let products = await apiService.getProducts()
    if (products.length > 0) {
            res.status(200).send(products)
    } else {
        res.status(204).send()
    }
}

export const postApi = async (req, res) => {
    try {
        let product = req.body
        let response = await apiService.addProduct(product)
        res.status(201).send(response)
    } catch (err) {
        res.status(400).send(err)
    } 
}

export const putApi = async (req, res) => {
    let {id} = req.params
    let product = req.body
    try {
        let result = await apiService.updateProduct(id, product)
        res.status(200).send(result)
    } catch (err) {
        res.status(400).send(err)
    }
}

export const deleteApi = async (req, res) => {
    let {id} = req.params
    let result = await apiService.getProductById(id)
    if (result.name) {
        try {
            let result = await apiService.deleteProduct(id)
            res.status(200).send(result)
        } catch (err) {
            res.status(400).send(err)
        }
    } else {
        res.status(204).send()
    }
}

export const getApiById = async (req, res) => {
    let {id} = req.params
    try {
        let result = await apiService.getProductById(id)
        if (result.name) {
            res.status(200).send(result)
        } else {
            res.status(204).send()
        }
        
    } catch (err) {
        res.status(400).send(err)
    }
}

