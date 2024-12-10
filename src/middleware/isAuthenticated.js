function isAuthenticated(req, res, next) {
    if (req.session && req.session.loggedUser && req.session.loggedUser._id) {
        return next();
    }

    res.status(401).send(
        'PLEASE <a href="/" style="color:blue; text-decoration: underline;  ">SIGNUP / SIGNIN</a>'
    );
    
}

module.exports = {
    isAuthenticated
};
