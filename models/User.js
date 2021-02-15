const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'The email address should be at least 3 characters long']
    },
    password: {
        type: String,
        required: true,
        minlength: [3, 'The password should be at least 3 characters long']
    },
    offers: []
});

module.exports = mongoose.model('User', userSchema);

//with validators and messages
// const userSchema = new mongoose.Schema({
//     id: mongoose.Types.ObjectId,
//     username: {
//         type: String,
//         required: [true, 'Username is required'],
//         unique: [true, 'Username must be unique'],
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     enrolledCourses: []
// });