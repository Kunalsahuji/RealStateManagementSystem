var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyrole } = require('../utility/auth')
const PropertySchema = require('../models/propertyModel')
const upload = require('../utility/multer')

/* Create Property */
router.post('/', isLoggedIn, varifyrole, upload.single("image"), async (req, res, next) => {
    try {
        const newProperty = new PropertySchema({
            ...req.body,
            image: req.file.filename,
            owner: req.user._id
        })
        await newProperty.save()
        res.send("Property Created!")
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

module.exports = router
