const mongoose = require("mongoose");


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Author must be provided"]
    },
    alias: {
        type: String,
        default:""
    },
    bio: {
        type: String,
        required: [true, "Author bio must be provided"]

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
    joinedAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null
    },
    genres: {
        type: String,
    },

})




module.exports = mongoose.model("Author", authorSchema);
