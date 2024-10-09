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
        user.appointment.push(newAppointment._id) 
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
        res.render('appointment-timeline', { appointments, user: req.user });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};


// Get a property for updating
const renderAppointment = async (req, res, next) => {
    try {
        const appointment = await AppointmentSchema.findById(req.params.id);
        res.render('update-appointment', { appointment, user: req.user });
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

const deleteAppointment = async (req, res, next) => {
    try {
        // 1. Fetch the appointment to delete
        const appointment = await AppointmentSchema.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        // 2. Find the user associated with the appointment
        const user = await UserSchema.findById(appointment.owner);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // 3. Remove the appointment from the user's appointments array
        user.appointment = user.appointment.filter(
            (appId) => appId.toString() !== appointment._id.toString()
        );
        await user.save(); // Save the updated user data

        // 4. Find the property related to the appointment
        const property = await PropertySchema.findById(appointment.property);
        if (property) {
            // Remove the appointment from the property's appointments array
            property.appointment = property.appointment.filter(
                (appId) => appId.toString() !== appointment._id.toString()
            );
            await property.save(); // Save the updated property data
        }

        // 5. Delete the appointment from the database
        await AppointmentSchema.findByIdAndDelete(req.params.id);

        // 6. Redirect to the appointment timeline or another appropriate page
        res.redirect('/appointment/timeline');
    } catch (error) {
        console.log('Error during appointment deletion:', error);
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