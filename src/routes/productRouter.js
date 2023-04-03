import { Router } from "express";
import ProductService from "../services/ProductService.js";
import { logger } from "../winston/config.js";

const router = Router()
const productManager = new ProductService()

router.get('/', async (req, res) => {
    logger.info(`Método ${req.method} ruta ${req.path}`)
    if (req.isAuthenticated()) {
        let products = await productManager.getProducts()
        let user = req.cookies?.user || req.session?.user
        res.render('dashboard', {user, products} )
    } else {
        res.redirect('/auth/login')
    }
}) 

router.post('/', async (req, res) => {
    logger.info(`Método ${req.method} ruta ${req.path}`)
    let product = req.body
    if (!product.title || !product.thumbnail || !product.price) {
        res.send({message: "Hay campos vacíos"})
    } else {
        let result = await productManager.addProduct(product)
        res.send(result)
    }
})

router.put('/:id', async (req, res) => {
    logger.info(`Método ${req.method} ruta ${req.path}`)
    let {id} = req.params
    let product = req.body
    if (!product.title || !product.thumbnail || !product.price) {
        res.send({
            message: "Hay campos vacíos"
        })
    } else {
        let result = await productManager.updateProduct(id, product)
        res.send(result)
    }
})

router.delete('/:id', async (req, res) => {
    logger.info(`Método ${req.method} ruta ${req.path}`)
    let {id} = req.params
    let result = await productManager.deleteProduct(id)
    res.send(result)
})

router.get('/:id', async (req, res) => {
    logger.info(`Método ${req.method} ruta ${req.path}`)
    let {id} = req.params
    let result = await productManager.getProductById(id)
    res.send(result)
})

export default router