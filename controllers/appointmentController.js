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
            // return res.status(400).json({ message: `You already booked an appointment for this property.<a href="/profile">Profile</a>` })
            return res.redirect('/profile?error=already_booked');

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
        res.redirect('/profile')
    } catch (error) {
        console.log(error)
        res.status(500).send('server error but meri galti nhi h!')
    }
}

// Appointment timeline
const getAppointmentTimeline = async (req, res, next) => {
    try {
        const appointments = await AppointmentSchema.find({ owner: req.user._id });
        // appointmentProp.forEach(prop => console.log(prop.property.title))
        res.render('Appointment-timeline', { appointments, user: req.user });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};


// Get a property for updating
const renderAppointment = async (req, res, next) => {
    try {
        const appointment = await AppointmentSchema.findById(req.params.id);
        res.render('update-Appointment', { appointment, user: req.user });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};


// Update appointment
const updateAppointment = async (req, res, next) => {
    try {
        const appointment = await AppointmentSchema.findByIdAndUpdate(req.params.id, req.body);
        await appointment.save()
        res.redirect('/appointment/timeline');
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

// Delete appointment
const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await AppointmentSchema.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        // Update related user and property
        await UserSchema.findByIdAndUpdate(appointment.user, {
            $pull: { appointments: appointment._id }
        });
        await PropertySchema.findByIdAndUpdate(appointment.property, {
            $pull: { appointments: appointment._id }
        });
        await AppointmentSchema.findByIdAndDelete(req.params.id);

        res.redirect('/appointment/timeline');
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};
module.exports = {
    getAppointment,
    postAppointment,
    getAppointmentTimeline,
    renderAppointment,
    updateAppointment,
    deleteAppointment
}