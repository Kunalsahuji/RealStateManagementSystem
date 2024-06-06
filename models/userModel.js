const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    roll: {
        type: String,
        enum: ["buyer", "seller", "agent"]
    }
})
const UserSchema = mongoose.model("user", userSchema)
module.exports = UserSchema