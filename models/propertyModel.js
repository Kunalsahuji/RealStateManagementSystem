const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    location: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    appointment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    }],
    status: {
        type: String,
        enum: ["available", "sold", "pending"],
        set: (val) => val.toLowerCase(),

    },
    image: String,

})
const PropertySchema = mongoose.model("Property", propertySchema)
module.exports = PropertySchema