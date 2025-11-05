const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Genre name must be provided"]
    },
    
    description: {
        type: String,
       default:""

    },
    visible: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    publishedAt: {
        type: Date,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    },
    

})


module.exports = mongoose.model("Genre", genreSchema);
