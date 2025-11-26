const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    enquiryId: {
        type: String,
        required: true,
        primary: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    reason: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
      },
          message: {
        type: String,
        required: true,
    },
      

});
const Enquiry= mongoose.model('enquries', userSchema); 
module.exports = Enquiry;
