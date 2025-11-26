const mongoose = require('mongoose');

const postSchema =new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        primary: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
      },
        url: {
        type: String,
        required: false,
    },
      

});
const User= mongoose.model('Post', postSchema); 
module.exports = User;