require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Database Connect")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
module.exports = connectDB

// const mongoose = require('mongoose');
// mongoose.connect("mongodb://0.0.0.0/REAL-ESTATE").then(() => {
//     console.log("DB Connected!")
// }).catch((err) => {
//     console.log(err)
// });