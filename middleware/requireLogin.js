module.exports = {
    requireLogin: function (req, res, next)
    {
        if (!req.session.userId) {
            res.redirect('/sign-in');
        } else {
            next();
        }
    }
}