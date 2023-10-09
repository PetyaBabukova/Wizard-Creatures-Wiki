const mongoose = require('mongoose');

const CreatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        // minlength: 2,
    },

    species: {
        type: String,
        required: [true, 'Species is required'],
        // minlength: 2,
    },

    skinColor: {
        type: String,
        required: [true, 'You need to specify the colcr of the skin'],
        // minlength: 2,
    },

    eyeColor: {
        type: String,
        required: [true, 'You need to specify the colcr of the eyes'],
        // minlength: 2,
    },

    image: {
        type: String,
        required: [true, 'Image Url is required'],
        // match: [/^https?:\/\//, 'Invalid URL'],
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        // minlength:5,
        // maxLength: 50
    },

    votes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },


});

const Creature = mongoose.model('Creature', CreatureSchema);

module.exports = Creature;