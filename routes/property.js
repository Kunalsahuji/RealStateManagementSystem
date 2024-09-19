var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyroleProperty } = require('../utility/auth')
const fs = require('fs');
const upload = require('../utility/multer');
const { getProperty, postProperty, renderProperty, getPropertyTimeline, updateProperty, deleteProperty } = require('../controllers/propertyController');

/* Create Property */
router.get('/create/:userId', isLoggedIn, varifyroleProperty, getProperty)

router.post('/create/:userId', isLoggedIn, varifyroleProperty, upload.single("image"), postProperty)

router.get('/timeline', isLoggedIn, varifyroleProperty, getPropertyTimeline);
router.get('/update/:id', isLoggedIn, varifyroleProperty, renderProperty);
router.post('/update/:id', isLoggedIn, varifyroleProperty, upload.single('image'), updateProperty);
router.get('/delete/:id', isLoggedIn, varifyroleProperty, deleteProperty);
module.exports = router
