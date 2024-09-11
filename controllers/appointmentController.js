const AppointmentSchema = require('../models/appointmentModel')

const getAppointment = (req, res, next) => {
    res.render('create-appointment',
        {
            owner: req.user_id,
            property: req.params.propertyId,
            user: req.user
        })
}
const postAppointment = async (req, res, next) => {
    try {
        const appointProperty = await AppointmentSchema.find().populate('property')
        const newAppointment = new AppointmentSchema({
            ...req.body,
            owner: req.user._id,
            property: req.params.propertyId,
            user: req.user,
            appointProperty
        })
        res.redirect('/user/profile')
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}

module.exports = {
    getAppointment,
    postAppointment
}