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

// delete property:
const deleteProperty = async (req, res, next) => {
    try {
        // Find the property by ID
        const property = await PropertySchema.findById(req.params.id);
        // If the property is not found, handle the error
        if (!property) {
            return res.status(404).send('Property not found');
        }

        // 1. Check and delete the image from the file system if it exists
        if (property.image) {
            const imagePath = `./public/images/${property.image}`;
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (error) => {
                        if (error) console.log('Error deleting image file:', error);
                    });
                } else {
                    console.log('Image file not found:', imagePath);
                }
            });
        }

        // 2. Remove the property from the database using findByIdAndDelete
        await PropertySchema.findByIdAndDelete(req.params.id);
        
        // 3. Delete all appointments associated with this property
        // await AppointmentSchema.deleteMany({ propertyId: req.params.id });
        await AppointmentSchema.deleteMany({ _id: { $in: property.appointment } });

        // 4. Update User's propertyCount
        const user = await UserSchema.findById(property.owner);
        if (user) {
            user.property.pull(property._id);
            // user.appointment.pull(appointment._id);

            await user.save();
        }
        console.log(user, "userowner")


        // 5. Redirect to the timeline after deletion
        console.log("Property and related appointments deleted");
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