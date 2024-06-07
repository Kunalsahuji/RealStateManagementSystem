var express = require('express');
var router = express.Router();
const UserSchema = require('../models/userModel')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { route } = require('../app');
const { isLoggedIn } = require('../utility/auth')
passport.use(UserSchema.createStrategy());

/* GET home page */
router.get('/', isLoggedIn, (req, res, next) => {
  res.send("Homepage")
})

// current user
router.post('/current', isLoggedIn, (req, res, next) => {
  res.send(req.user)
})

// register user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, roll } = req.body
    const newUser = new UserSchema({ name, email, roll })
    await UserSchema.register(newUser, password)
    res.send("User Registered!")
  } catch (error) {
    console.log(error.message)
    res.send(error)
  }
})

// login user
router.post('/login', passport.authenticate("local"), (req, res, next) => {
  try {
    res.send("User logged in")
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})

// logout user
router.get('/logout', (req, res, next) => {
  try {
    req.logout(() => {
      res.send("User logged out")
    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})
module.exports = router;
