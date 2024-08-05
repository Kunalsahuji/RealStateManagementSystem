var express = require('express');
var router = express.Router();
const AppointmentSchema = require('../models/appointmentModel')
const { isLoggedIn, varifyroleAppointment } = require('../utility/auth')


/* Create appointment */
router.get('/:propertyId', isLoggedIn, varifyroleAppointment, (req, res, next) => {
    res.render('create-appointment',
        {
            owner: req.user_id,
            property: req.params.propertyId,
            user: req.user_id
        })
})

router.post('/:propertyId', isLoggedIn, varifyroleAppointment, async (req, res, next) => {
    try {
        const newAppointment = new AppointmentSchema({
            ...req.body,
            owner: req.user._id,
            property: req.params.propertyId,
            user: req.user

        })
        await newAppointment.save()
        res.redirect('/user/profile')
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

module.exports = router