import { getAll } from "../services/product.service.js"


export const getProduct = async (req, res) => {
    if (req.isAuthenticated()) {
        let products = getAll()
        let user = req.cookies?.user || req.session?.user
        res.render('dashboard', {user, products} )
    } else {
        res.redirect('/auth/login')
    }
}

