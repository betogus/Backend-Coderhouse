import { enviarEmail } from "../services/cart.service.js";


export const getCart = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('cart')
    } else {
        res.redirect('/auth/login')
    }
}

export const postCart = async (req, res) => {
    const userId = req.session.passport?.user;
    if (userId) {
        let productosEnElCarrito = (req.body)
        enviarEmail(userId, productosEnElCarrito)
        .then(status => {
            res.status(status).send()
        })
    } else {
        res.redirect('/auth/login')
    }
}