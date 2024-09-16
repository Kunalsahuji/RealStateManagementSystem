const AppointmentSchema = require('../models/appointmentModel');
const PropertySchema = require('../models/propertyModel');
const UserSchema = require('../models/userModel');
require('dotenv').config();

const getAppointment = async (req, res, next) => {
    try {
        const property = await PropertySchema.findById(req.params.propertyId).populate('owner')
        if (!property) {
            return res.status(404).send("Property Not Fount!")
        }
        res.render('create-appointment',
            {
                owner: req.user_id,
                property: property,
                user: req.user,
                propertyId: req.params.propertyId,
            })
    } catch (error) {
        console.log(error)
        res.status(500).send('server error but meri galti nhi h!')
    }
}
const postAppointment = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        const userId = req.user._id
        const property = await PropertySchema.findById(req.params.propertyId)
        const propertyId = req.params.propertyId;
        const existingAppointment = await AppointmentSchema.findOne({
            property: propertyId,
            owner: userId
        })

        if (!property) {
            return res.status(404).send("Property Not Fount!")
        }
        if (existingAppointment) {
            // return res.status(400).json({ message: `You already booked an appointment for this property.<a href="/user/profile">Profile</a>` })
            return res.redirect('/user/profile?error=already_booked');

        }

        const newAppointment = new AppointmentSchema({
            status: req.body.status,
            date: req.body.date,
            owner: user._id,
            property: propertyId,
        })
        await newAppointment.save()
        user.appointment.push(newAppointment._id) //appointment push into userSchema
        await property.appointment.push(newAppointment._id)
        await user.save()
        await property.save()
        res.redirect('/user/profile')
    } catch (error) {
        console.log(error)
        res.status(500).send('server error but meri galti nhi h!')
    }
}

module.exports = {
    getAppointment,
    postAppointment
}