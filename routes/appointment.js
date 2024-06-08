var express = require('express');
var router = express.Router();
const AppointmentSchema = require('../models/appointmentModel')
const { isLoggedIn, varifyroleAppointment } = require('../utility/auth')


/* Create appointment */
router.post('/:propertyId', isLoggedIn, varifyroleAppointment, async (req, res, next) => {
    try {
        const newAppointment = new AppointmentSchema({
            ...req.body,
            user: req.user._id,
            property: req.params.propertyId
        })
        await newAppointment.save()
        res.send("Appointment Created!")
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

module.exports = router