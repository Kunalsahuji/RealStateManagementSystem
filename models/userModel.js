const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    roll: {
        type: String,
        enum: ["buyer", "seller", "agent"]
    }
})
userSchema.plugin(plm, { usernameField: "email" })
const UserSchema = mongoose.model("user", userSchema)
module.exports = UserSchema