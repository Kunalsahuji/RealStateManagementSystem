const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["buyer", "seller", "agent"],
        set: (val) => val.toLowerCase(),
    },

})
userSchema.plugin(plm, { usernameField: "email" })
const UserSchema = mongoose.model("User", userSchema)
module.exports = UserSchema