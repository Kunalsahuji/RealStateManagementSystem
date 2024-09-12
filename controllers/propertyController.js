const PropertySchema = require('../models/propertyModel');
const UserSchema = require('../models/userModel');
require('dotenv').config();

const getProperty = (req, res, next) => {
    res.render('create-property', { user: req.user })
}
const postProperty = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        const newProperty = new PropertySchema({
            ...req.body,
            image: req.file.filename,
            owner: user._id,
        })
        await newProperty.save()
        user.property.push(newProperty._id)
        await user.save()
        console.log(`user: ${user}\nproperty: ${newProperty}`)
        res.redirect('/user/profile')

    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}
module.exports = {
    getProperty,
    postProperty
}