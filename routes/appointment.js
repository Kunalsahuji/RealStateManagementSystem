var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyroleAppointment } = require('../utility/auth');
const { getAppointment, postAppointment, renderAppointment, updateAppointment, deleteAppointment, getAppointmentTimeline } = require('../controllers/appointmentController');


/* Create appointment */
router.get('/create/:propertyId', isLoggedIn, varifyroleAppointment, getAppointment)

router.post('/create/:propertyId', isLoggedIn, varifyroleAppointment, postAppointment)



router.get('/timeline', isLoggedIn, varifyroleAppointment, getAppointmentTimeline);
router.get('/update/:id', isLoggedIn, varifyroleAppointment, renderAppointment);
router.post('/update/:id', isLoggedIn, varifyroleAppointment, updateAppointment);
router.get('/delete/:id', isLoggedIn, varifyroleAppointment, deleteAppointment);
module.exports = router