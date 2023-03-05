const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'This field is required.'
    },

    lastName: {
        type: String,
        required: 'This field is required.'
    },

    email: {
        type: String,
        required: 'This field is required.'
    },

    addressFirstLine: {
        type: String,
  
        required: 'This field is required.'
    },

    addressSecondLine: {
        type: String
    },

    city: {
        type: String,
        required: 'This field is required.'
    },

    state: {
        type: String,
        required: 'This field is required.'
    },

    zipCode: {
        type: String,
        required: 'This field is required.'
    },

    creditCardNumber: {
        type: String,
        required: 'This field is required.'
    },

    expirationDate: {
        type: String,
        required: 'This field is required.'
    },

    securityCode: {
        type: String,
        required: 'This field is required.'
    },
    
});


subscriberSchema.index({ name: 'text', description: 'text'});
module.exports = mongoose.model('Subscriber', subscriberSchema);