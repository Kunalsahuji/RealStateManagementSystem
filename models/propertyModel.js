const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    location: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["available", "sold", "pending"]
    },
    image: String,

})
const PropertySchema = mongoose.model("property", propertySchema)
module.exports = PropertySchema