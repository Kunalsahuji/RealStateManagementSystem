const PropertySchema = require('../models/propertyModel')
const getProperty = (req, res, next) => {
    res.render('create-property', { user: req.user })
}
const postProperty = async (req, res, next) => {
    try {
        const newProperty = new PropertySchema({
            ...req.body,
            image: req.file.filename,
            owner: req.user._id,
            user: req.user

        })
        await newProperty.save()
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