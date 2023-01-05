const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },

    description: {
        type: String,
        required: 'This field is required.'
    },

    link: {
        type: String,
        required: 'This field is required.'
    },

    category: {
        type: String,
  
        required: 'This field is required.'
    },

    image: {
        type: String,
        required: 'This field is required.'
    }

});


recipeSchema.index({ name: 'text', description: 'text'});
module.exports = mongoose.model('Recipe', recipeSchema);