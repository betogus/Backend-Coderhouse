export const isAuth = (req, res, next) => {
    if (req.session?.user && req.cookies?.user_sid) return next()
    else res.redirect("/auth/login")
}