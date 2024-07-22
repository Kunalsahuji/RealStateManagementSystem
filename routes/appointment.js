var express = require('express');
var router = express.Router();
const AppointmentSchema = require('../models/appointmentModel')
const { isLoggedIn, varifyroleAppointment } = require('../utility/auth')


/* Create appointment */
router.get('/:propertyId', isLoggedIn, varifyroleAppointment, (req, res, next) => {
    res.render('create-appointment',
        {
            user: req.user,
            pid: req.params.propertyId
        })
})

router.post('/:propertyId', isLoggedIn, varifyroleAppointment, async (req, res, next) => {
    try {
        const newAppointment = new AppointmentSchema({
            ...req.body,
            user: req.user._id,
            pid: req.params.propertyId
        })
        await newAppointment.save()
        res.redirect('/user/profile')
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

module.exports = router