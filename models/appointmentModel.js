const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    property: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        set: (val) => val.toLowerCase(),

    },
    date: Date,
}, { timestamps: true }
)
const AppointmentSchema = mongoose.model("Appointment", appointmentSchema)
module.exports = AppointmentSchema