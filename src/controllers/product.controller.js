import { getAll } from "../services/product.service.js"


export const getProduct = async (req, res) => {
    let products = getAll()
    let user = req.cookies?.user || req.session?.user
    res.render('dashboard', {user, products} )
}

