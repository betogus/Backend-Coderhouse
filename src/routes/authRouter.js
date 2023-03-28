import { Router } from "express";
import passport from "passport";
import path from 'path'

const router = Router()
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/register/index.html'))
})

router.post('/register', passport.authenticate('register', 
{failureRedirect: '/auth/registerError'}), (req, res) => {
    req.session.user = req.body
    res.redirect('/products')   
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/login/index.html'))
})

router.post('/login', passport.authenticate('login',
{failureRedirect: '/auth/loginError'}), async (req, res) => {
    req.session.user = req.body
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        let {username} = req.session.user
        res.render('logout', {username})
    } else {
        res.redirect('/auth/login')
    }
})

router.get('/clearCookies', (req, res) => {
    req.logout(function(err) {
        if (err) { console.log(err); }
        res.clearCookie('user_sid')
        req.session.destroy()
        res.redirect('/auth/login')
    })
})

router.get('/loginError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/loginError/index.html'))
})

router.get('/registerError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/registerError/index.html'))
})

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/loginError'}), (req, res) => {
    let username = req.user.displayName
    let first_name = req.user.name.givenName
    let last_name = req.user.name.familyName
    let email = req.user.emails.value
    let photoURL = req.user.photos.value
    req.session.user = {username, first_name, last_name, email, photoURL}
    res.redirect('/products')
})


export default router