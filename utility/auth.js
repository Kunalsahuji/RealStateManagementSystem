const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect('/login')
    }

}

const varifyroleProperty = (req, res, next) => {
    if (req.user.role == "seller" || req.user.role == "agent") {
        next()
    }
    else {
        res.send('Only buyer have the permission to get appointment property<a href="/profile">Profile</a>')
    }
}

const varifyroleAppointment = (req, res, next) => {
    if (req.user.role == "buyer") {
        next()
    }
    else {
        res.send(
            'Only buyer have the permission to get appointment property<a href="/profile">Profile</a>'
        );
    }
}

module.exports = { isLoggedIn, varifyroleProperty, varifyroleAppointment }