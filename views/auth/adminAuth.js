//middleware for admin authentication session
module.exports = (req,res, next) => {
    if (req.session.user == 'admin') {
        next()
    } else {
        res.json({message: "You do not have access"})
    }
}