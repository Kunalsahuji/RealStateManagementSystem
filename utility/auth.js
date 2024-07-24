const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.send(
            "Log in to access the resource.<a href='/user/login'>Login</>"
        );
    }


}

const varifyroleProperty = (req, res, next) => {
    if (req.user.role == "seller" || req.user.role == "agent") {
        next()
    }
    else {
        res.send("Only seller or agent have the permission to create property!")
    }
}

const varifyroleAppointment = (req, res, next) => {
    if (req.user.role == "buyer") {
        next()
    }
    else {
        res.send(
            'Only buyer have the permission to get appointment property<a href="/user/profile">Profile</a>'
        );
    }
}

module.exports = { isLoggedIn, varifyroleProperty, varifyroleAppointment }