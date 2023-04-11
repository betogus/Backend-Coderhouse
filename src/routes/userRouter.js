import { Router } from "express"
import { isAuth } from "../middlewares/middlewares.js"
import { users } from "../models/User.js"
const router = Router()

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userId = req.session.passport.user;
            const user = await users.findById(userId);
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo,
                address: user.address,
                age: user.age,
                phone: user.phone
            });
        } catch (err) {
            const user = req.session.user
            console.log(user)
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo && user.photo,
                photoURL: user.photoURL && user.photoURL,
                address: user.address && user.address,
                age: user.age && user.age,
                phone: user.phone && user.phone
            })
        }
    } else {
        res.redirect('/auth/login')
    }
    
})

export default router