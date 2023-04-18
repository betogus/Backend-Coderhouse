
export const getCart = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('cart')
    } else {
        res.redirect('/auth/login')
    }
}

