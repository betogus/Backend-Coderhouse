export const getChat = async (req, res) => {
    if (req.isAuthenticated()) {
       res.render('chat')
    } else {
        res.redirect('/auth/login')
    }
    
}