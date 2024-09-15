const PropertySchema = require('../models/propertyModel');
const UserSchema = require('../models/userModel');
require('dotenv').config();

const getProperty = async (req, res, next) => {
    // const properties = await PropertySchema.find({})
    //     .populate('owner')
    //     .populate({ path: 'appointment', populate: { path: 'owner' } });
    const userId = UserSchema.findById(req.params.userId)
    res.render('create-property', { user: req.user, userId })
}
const postProperty = async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.user._id);
        const userId = await UserSchema.findById(req.params.userId)
        const newProperty = new PropertySchema({
            ...req.body,
            image: req.file.filename,
            owner: user._id,
            userId: userId
        })
        user.property.push(newProperty._id)
        await newProperty.save()
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