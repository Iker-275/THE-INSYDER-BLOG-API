const mongoose = require("mongoose");


const articleSchema = new mongoose.Schema({
    title:{
    type:String,
    required:[true,"Article title must be provided"]
},
content:{
    type:String,
    required:[true,"Article Content must be provided"]

},
author:{
    type:String,
    required:[true,"Article Author must be provided"]

},
visible:{
    type:Boolean,
    default:false
},
imageUrl:{
    type:String,
    default:null
},
createdAt:{
    type:Date,
    default:Date.now()
},
publishedAt:{
    type:Date,
    default:null
},
updatedAt:{
    type:Date,
    default:null
},
genre:{
    type:String,
},

})




module.exports = mongoose.model("Article",articleSchema);
