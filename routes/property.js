var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyroleProperty } = require('../utility/auth')
const PropertySchema = require('../models/propertyModel')
const upload = require('../utility/multer')

/* Create Property */
router.get('/', isLoggedIn, (req, res, next) => {
    res.render('create-property', { user: req.user })
}
)

router.post('/', isLoggedIn, varifyroleProperty, upload.single("image"), async (req, res, next) => {
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
})

module.exports = router
