// const mongoose = require('mongoose');
// const connectDB = async () => {
//     try {
//         const connect =await mongoose.connect(process.env.CONNECTION_STRING)
//         console.log("Database Connect")
//     } catch (error) {
//         console.log(error)
//         process.exit(1)
//     }
// }
// module.exports = connectDB
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log("Database Connect")
    }).catch((err) => {
        console.log(err)
    });
