const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.send("Log in to access the resource.")
    }
}

const varifyroleProperty = (req, res, next) => {
    if (req.user.roll == "seller") {
        next()
    }
    else {
        res.send("Only seller have the permission to create property!")
    }
}

const varifyroleAppointment = (req, res, next) => {
    if (req.user.roll == "buyer") {
        next()
    }
    else {
        res.send("Only buyer have the permission to create appointment!")
    }
}

module.exports = { isLoggedIn, varifyroleProperty, varifyroleAppointment }