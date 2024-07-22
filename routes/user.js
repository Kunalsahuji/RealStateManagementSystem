var express = require('express');
var router = express.Router();
const UserSchema = require('../models/userModel')
const PropertySchema = require('../models/propertyModel')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../utility/auth')
passport.use(UserSchema.createStrategy());

/* GET home page */
router.get('/', async (req, res, next) => {
  try {
    const properties = await PropertySchema.find()
    res.render('index', {
      properties: properties,
      user: req.user
    })
  } catch (error) {
    console.log(error.message)
    res.send(error)
  }
})

// current user
router.post('/current', isLoggedIn, (req, res, next) => {
  console.log(req.user)
  res.send(req.user)

})

// register user
router.get('/register', (req, res, next) => {
  res.render('register', {
    user: req.user
  })
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, roll } = req.body
    const newUser = new UserSchema({ name, email, roll })
    await UserSchema.register(newUser, password)
    res.redirect('/login')
  } catch (error) {
    console.log(error.message)
    res.send(error)
  }
})

// login user
router.get('/login', (req, res, next) => {
  res.render("login", { user: req.user })
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/user/profile",
  failureRedirect: "/user/login",
}),
  (req, res, next) => { }
)

// logout user
router.get('/logout', (req, res, next) => {
  try {
    req.logout(() => {
      res.redirect('/user')
    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})

// profile
router.get('/profile', isLoggedIn, async (req, res, next) => {
  try {
    const properties = await PropertySchema.find()
    res.render('profile', {
      properties: properties,
      user: req.user
    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})
module.exports = router;
