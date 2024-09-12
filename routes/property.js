var express = require('express');
var router = express.Router();
const { isLoggedIn, varifyroleProperty } = require('../utility/auth')

const upload = require('../utility/multer');
const { getProperty, postProperty } = require('../controllers/propertyController');

/* Create Property */
router.get('/', isLoggedIn, varifyroleProperty, getProperty)

router.post('/', isLoggedIn, varifyroleProperty, upload.single("image"), postProperty)

module.exports = router
