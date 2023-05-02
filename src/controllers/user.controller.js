

export const getUser = async (req, res) => {
    try {
        const user = req.cookies.user || req.session.user;
        res.render('user', {
            username: user.username,
            email: user.email,
            photo: user.photo,
            address: user.address,
            age: user.age,
            phone: user.phone
        });
    } catch (err) {
        const user = req.cookies.user || req.session.user;
        res.render('user', {
            username: user.username,
            email: user.email,
            photo: user.photo && user.photo,
            address: user.address && user.address,
            age: user.age && user.age,
            phone: user.phone && user.phone
        })
    }
}