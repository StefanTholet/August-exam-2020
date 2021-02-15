const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        min: 0
    },
    brand: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true,
        minlength: 8
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?/,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    createdOn: {
        type: String,
        required: true
    },
    buyers: []
});

module.exports = mongoose.model('Product', productSchema);

//with custom validators and error messages 
// const productSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         minlength: [4, 'Title must be at least 4 characters long'],
//         required: true,

//     },
//     description: {
//         type: String,
//         required: true,
//         minlength: [20, 'Title must be at least 20 characters long']
//     },
//     imageUrl: {
//         type: String,
//         validate: {
//             validator: function (v) {
//                 return startsWithHttpOrHttps.test(v);
//             },
//             message: props => `${props.value} is not a valid image url.`
//         },
//         required: [true, 'Image url is required']
//     },
//     createdOn: {
//         type: String,
//         required: true,
//     },
//     creator: {
//         type: mongoose.Types.ObjectId,
//         ref: 'User'
//     },
//     duration: {
//         type: String,
//         required: [true, 'Course duration is a required field']
//     },
//     enrolledUsers: []
// });

// module.exports = mongoose.model('Product', productSchema);