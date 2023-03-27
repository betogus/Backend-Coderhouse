import { Router } from "express";
import path from 'path'
import { isAuth } from "../middlewares/middlewares.js";
import { UserModel } from "../models/User.js";

const router = Router()
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/register/index.html'))
})

router.post('/register', async (req, res) => {
    let {username, email, password} = req.body
    let user = new UserModel({
        username: username,
        email: email,
        password: password
    })
    try {
        let findUser = await UserModel.findOne({username}).exec()
        if (!findUser) {
            let newUser = await user.save() 
            req.session.user = newUser 
            res.redirect('/products') 
        } else {
            res.redirect('/auth/registerError')
        }
    } catch (err) {
        console.log("err" + err)
    }
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/login/index.html'))
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body
    try {
        let user = await UserModel.findOne({username}).exec()
        if (!user || user.password != password) {
           res.redirect('/auth/loginError')
        }
        req.session.user = user
        res.redirect('/products')
        }
    catch(err) {
        console.log("err:" + err)
    }

})

router.get('/logout', isAuth, (req, res) => {
    let {username} = req.session.user
    res.render('logout', {username})
})

router.get('/clearCookies', (req, res) => {
    res.clearCookie('user_sid')
    req.session.destroy()
    res.redirect('/auth/login')
})

router.get('/loginError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/loginError/index.html'))
})

router.get('/registerError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/registerError/index.html'))
})
export default router