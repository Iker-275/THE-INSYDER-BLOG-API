const mongoose = require("mongoose");
const { isEmail ,isLength, isStrongPassword} = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
email: {
        type: String,
    
        required: [true, "Email must be provided"],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    
    password: {
        type: String,
        minLength:6,
       required:[true,"Password is a required"],
      // validate:[isLength,'Minimum password length is 6']

    },
    visible: {
        type: Boolean,
        default: true
    },
     author: {
        type: Boolean,
        default: false
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

//webhooks for hashing
userSchema.pre('save',async function(next){
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
    next();
})
//user login
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});

    if(user){
       const auth = await bcrypt.compare(password,user.password)
       if(auth){
        return user;
       }
       throw Error("Incorrect password")
    }
    throw Error("Incorrect email")
}

module.exports = mongoose.model("User",userSchema);