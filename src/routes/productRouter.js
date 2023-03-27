import { Router } from "express";
import { isAuth } from "../middlewares/middlewares.js";
import ProductService from "../services/ProductService.js";

const router = Router()
const productManager = new ProductService()

router.get('/', isAuth, async (req, res) => {
    let products = await productManager.getProducts()
    let user = req.cookies?.user || req.session?.user
    res.render('dashboard', {user, products} )

}) 

router.post('/', async (req, res) => {
    let product = req.body
    if (!product.title || !product.thumbnail || !product.price) {
        res.send({message: "Hay campos vacíos"})
    } else {
        let result = await productManager.addProduct(product)
        res.send(result)
    }
})

router.put('/:id', async (req, res) => {
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
    let {id} = req.params
    let result = await productManager.deleteProduct(id)
    res.send(result)
})

router.get('/:id', async (req, res) => {
    let {id} = req.params
    let result = await productManager.getProductById(id)
    res.send(result)
})

export default router