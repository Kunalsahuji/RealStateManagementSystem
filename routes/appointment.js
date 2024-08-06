var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyroleAppointment } = require('../utility/auth');
const { getAppointment, postAppointment } = require('../controllers/appointmentController');


/* Create appointment */
router.get('/:propertyId', isLoggedIn, varifyroleAppointment, getAppointment)

router.post('/:propertyId', isLoggedIn, varifyroleAppointment, postAppointment)

module.exports = router