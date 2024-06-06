const mongoose = require('mongoose');
const propertySchema = mongoose.Schema({
    title: String,
    description: String,
    price: String,
    location: String,
    image: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["available", "sold", "pending"]
    },
})
const PropertySchema = mongoose.model("property", propertySchema)
module.exports = PropertySchema