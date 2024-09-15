const AppointmentSchema = require('../models/appointmentModel');
const PropertySchema = require('../models/propertyModel');
const UserSchema = require('../models/userModel');
require('dotenv').config();

const getAppointment = async (req, res, next) => {
    try {
        const appointProperty = await AppointmentSchema.find().populate('property')

        res.render('create-appointment',
            {
                owner: req.user_id,
                property: req.params.propertyId,
                user: req.user,
                appointProperty
            })
    } catch (error) {

    }
}
const postAppointment = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        const appointProperty = await AppointmentSchema.find().populate('property')
        const property = PropertySchema.findById(req.params.propertyId)
        const Appointment = new AppointmentSchema({
            ...req.body,
            owner: user._id,
            property: req.params.propertyId,
        })
        user.appointment.push(Appointment._id) //appointment push into userSchema
        await Appointment.save()
        await user.save()
        await property.appointment.push(Appointment._id)
        await property.save()
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