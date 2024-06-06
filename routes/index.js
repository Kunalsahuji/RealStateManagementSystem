var express = require('express');
var router = express.Router();
const UserSchema = require('../models/userModel')
const PropertySchema = require('../models/propertyModel')
const AppointmentSchema = require('../models/appointmentModel')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
