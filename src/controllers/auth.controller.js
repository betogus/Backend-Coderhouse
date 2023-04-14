
import path from 'path'

const __dirname = path.resolve();

export const postRegister = (req, res) => {
    let user = req.body
    user.photo = req.file.filename
    req.session.user = user
    res.redirect('/dashboard')
}

export const getRegister = (req, res) => {
    res.sendFile(path.join(__dirname, './public/register/index.html'))
}

export const getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, './public/login/index.html'))
}

export const getLogout = (req, res) => {
    if (req.isAuthenticated()) {
        let {username} = req.session.user
        res.render('logout', {username})
    } else {
        res.redirect('/auth/login')
    }
}

export const clearCookies = (req, res) => {
    req.logout(function(err) {
        if (err) { console.log(err); }
        res.clearCookie('user_sid')
        req.session.destroy()
        res.redirect('/auth/login')
    })
}

export const getLoginError = (req, res) => {
    res.sendFile(path.join(__dirname, './public/loginError/index.html'))
}

export const getRegisterError = (req, res) => {
    res.sendFile(path.join(__dirname, './public/registerError/index.html'))
}

export const getGoogle = (req, res) => {
    let username = req.user.displayName
    let first_name = req.user.name.givenName
    let last_name = req.user.name.familyName
    let email = req.user.emails[0].value
    let photoURL = req.user.photos[0].value
    req.session.user = {username, first_name, last_name, email, photoURL}
    res.redirect('/dashboard')
}

export const postLogin = (req, res) => {
    req.session.user = req.body
    res.redirect('/dashboard')
}