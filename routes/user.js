var express = require('express');
var router = express.Router();
const UserSchema = require('../models/userModel')
const PropertySchema = require('../models/propertyModel')
const AppointmentSchema = require('../models/appointmentModel');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../utility/auth');
passport.use(UserSchema.createStrategy());

/* GET home page */
router.get('/', async (req, res, next) => {
  try {
    const properties = await PropertySchema.find()
    const appointment = await AppointmentSchema.find()

    res.render('index', {
      properties: properties,
      appointments: appointment,
      user: req.user,
      pid: req.params.propertyId

    })
  } catch (error) {
    console.log(error.message)
    res.send(error)
  }
})

// current user
router.get('/current', async (req, res, next) => {
  const properties = await PropertySchema.find()
  const appointments = await AppointmentSchema.find()

  res.render("index", {
    properties: properties,
    user: req.user,
    appointments: appointments,
    pid: req.params.propertyId

  })
})
router.post('/current', isLoggedIn, async (req, res, next) => {
  const properties = await PropertySchema.find()
  const appointments = await AppointmentSchema.find()
  req.render("index", {
    properties: properties,
    appointments: appointments,
    user: req.user,
    pid: req.params.propertyId

  })

})

// register user
router.get('/register', (req, res, next) => {
  res.render('register', {
    user: req.user
  })
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    const newUser = new UserSchema({ name, email, role })
    await UserSchema.register(newUser, password)
    await newUser.save()
    res.redirect("/user/login")
  } catch (error) {
    console.log(error)
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
    const appointments = await AppointmentSchema.find()
    res.render('profile', {
      properties: properties,
      appointments: appointments,
      user: req.user,
      pid: req.params.propertyId

    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
})
module.exports = router;
