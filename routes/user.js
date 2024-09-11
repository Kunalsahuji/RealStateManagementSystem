var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../utility/auth');
const {
    homepage,
    aboutpage,
    currentUser,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout,
    profile
} = require('../controllers/userController');


/* GET home page */
router.get('/', homepage)

router.get('/about', aboutpage)

// register user
router.get('/register', getRegister)

router.post('/register', postRegister)

// login user
router.get('/login', getLogin)

router.post('/login', postLogin, (req, res, next) => { })

// logout user
router.get('/logout', isLoggedIn, getLogout)

// profile
router.get('/profile', isLoggedIn, profile)
module.exports = router;
