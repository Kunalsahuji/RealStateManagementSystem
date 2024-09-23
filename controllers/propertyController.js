const PropertySchema = require('../models/propertyModel');
const UserSchema = require('../models/userModel');
const AppointmentSchema = require('../models/appointmentModel')
require('dotenv').config();
const fs = require('fs');

const getProperty = async (req, res, next) => {

    const userId = UserSchema.findById(req.params.userId)
    res.render('create-property', { user: req.user, userId })
}
const postProperty = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        const newProperty = new PropertySchema({
            ...req.body,
            image: req.file.filename,
            owner: user._id,
        })
        user.property.push(newProperty._id)
        await newProperty.save()
        await user.save()
        res.redirect('/profile')

    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}
// Property timeline
const getPropertyTimeline = async (req, res, next) => {
    try {
        const properties = await PropertySchema.find({ owner: req.user._id });
        res.render('property-timeline', { properties, user: req.user });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

// Get a property for updating
const renderProperty = async (req, res, next) => {
    try {
        const property = await PropertySchema.findById(req.params.id);
        res.render('update-property', { property, user: req.user });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

// Update property
const updateProperty = async (req, res, next) => {
    try {
        const property = await PropertySchema.findById(req.params.id);

        // Update property fields
        property.title = req.body.title;
        property.description = req.body.description;
        property.price = req.body.price;
        property.location = req.body.location;
        property.status = req.body.status;

        // Handle image update
        if (req.file) {
            // Delete old image
            if (property.image) {
                fs.unlinkSync(`./public/images/${property.image}`);
            }
            property.image = req.file.filename;
        }

        await property.save();
        res.redirect('/property/timeline');
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};



const deleteProperty = async (req, res, next) => {
    try {
        // 1. Find the property by ID
        const property = await PropertySchema.findById(req.params.id).populate('appointment');
        if (!property) {
            return res.status(404).send('Property not found');
        }

        // 2. Delete associated image from file system (if it exists)
        if (property.image) {
            const imagePath = `./public/images/${property.image}`;
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (error) => {
                        if (error) console.log('Error deleting image file:', error);
                    });
                }
            });
        }

        // 3. Get the owner (agent/seller) of the property and remove it from their property array
        const owner = await UserSchema.findById(property.owner);
        if (owner) {
            // Remove the property from the user's properties array
            owner.property = owner.property.filter(
                (propId) => propId.toString() !== property._id.toString()
            );

            await owner.save(); // Save the updated user data
        }

        // 4. Find all appointments associated with the property
        const propertyAppointments = await AppointmentSchema.find({ property: property._id });

        if (propertyAppointments.length > 0) {
            // 5. Delete all appointments associated with this property
            await AppointmentSchema.deleteMany({ property: property._id });

            // 6. Remove appointments from users who booked them
            for (let appointment of propertyAppointments) {
                const buyer = await UserSchema.findById(appointment.owner);
                if (buyer && buyer.role === 'buyer') {
                    // Remove the appointment from the buyer's appointment array
                    buyer.appointment = buyer.appointment.filter(
                        (appId) => appId.toString() !== appointment._id.toString()
                    );

                    await buyer.save(); // Save the updated buyer data
                }
            }
        }

        // 7. Delete the property itself
        await PropertySchema.findByIdAndDelete(req.params.id);

        console.log("Property and related appointments deleted");

        // 8. Redirect to the property timeline or appropriate page
        res.redirect('/property/timeline');
    } catch (error) {
        console.log('Error during property deletion:', error);
        res.send(error.message);
    }
};

module.exports = {
    renderProperty,
    postProperty,
    getPropertyTimeline,
    getProperty,
    updateProperty,
    deleteProperty,
} 