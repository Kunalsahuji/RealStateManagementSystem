const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    property: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
    }],
    appointment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    }],
    role: {
        type: String,
        enum: ["buyer", "seller", "agent"],
        set: (val) => val.toLowerCase(),
    },

}, { timestamps: true }
)
userSchema.plugin(plm, { usernameField: "email" })
const UserSchema = mongoose.model("User", userSchema)
module.exports = UserSchema