
import path from 'path'

const __dirname = path.resolve();

export const postRegister = (req, res) => {
    res.redirect('/dashboard')
}

export const getRegister = (req, res) => {
    res.sendFile(path.join(__dirname, './public/register/index.html'))
}

export const getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, './public/login/index.html'))
}

export const getLogout = (req, res) => {
        let {username} = req.cookies.user || req.session.user
        res.render('logout', {username})
}

export const clearCookies = (req, res) => {
    res.clearCookie('user_sid')
    res.clearCookie('user')
    res.clearCookie('token')
    req.session.destroy()
    res.redirect('/auth/login')
}

export const getLoginError = (req, res) => {
    let title= "Login Error"
    let detail = "Usuario y/o contraseña incorrectos"
    res.render('error.ejs', {title, detail})
}

export const getRegisterError = (req, res) => {
    let title = "Register Error"
    let detail = "Usuario y/o email ya existen"
    res.render('error.ejs', {title, detail})
}

export const getGoogle = (req, res) => {
    let username = req.user.displayName
    let first_name = req.user.name.givenName
    let last_name = req.user.name.familyName
    let email = req.user.emails[0].value
    let photoURL = req.user.photos[0].value
    res.cookie('user', {username, first_name, last_name, email, photoURL})
    req.session.user = {username, first_name, last_name, email, photoURL}
    res.redirect('/dashboard')
}

export const postLogin = (req, res) => {
    res.redirect('/dashboard')
}