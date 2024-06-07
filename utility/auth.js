const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.send("Log in to access the resource.")
    }
}

const varifyrole = (req, res, next) => {
    if (req.user.roll == "seller") {
        next()
    }
    else {
        res.send("Only seller have the permission to create property!")
    }
}

module.exports = { isLoggedIn, varifyrole }