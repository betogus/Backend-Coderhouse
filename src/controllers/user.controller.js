import { getUserById } from "../services/user.service.js";


export const getUser = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userId = req.session.passport.user;
            const user = await getUserById(userId);
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
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo && user.photo,
                address: user.address && user.address,
                age: user.age && user.age,
                phone: user.phone && user.phone
            })
        }
    } else {
        res.redirect('/auth/login')
    }

}