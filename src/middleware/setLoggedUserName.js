function setLoggedUserName(req, res, next) {

    if(req.session){
        res.locals.user = req.session.loggedUser.email.split("@")[0]
        return next();
    }
    
    res.status(401).send("Please Signin");
}

module.exports = {
    setLoggedUserName
};
