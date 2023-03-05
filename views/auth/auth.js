//middleware for authentication session
module.exports = (req,res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.json({message: "You are not logged in"})
    }
}