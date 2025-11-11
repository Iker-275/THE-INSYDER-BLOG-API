const User = require("../models/user");
const jwt = require("jsonwebtoken");

const maxAge = 1 * 24 *  60 * 60; //age in seconds -1 day


const handleErrors = (err) => {
    console.log(err.message);
    let errors = { email: "", password: "" };

    if (err.message === 'Incorrect password') {
        errors.password = "You have entered an incorrect password.Try again.";
        return errors;
    }

    if (err.message ==='Incorrect email') {
        errors.email = "Email is not registered.Try again.";
        return errors;
    }


    //duplicate error code
    if (err.code === 11000) {
        errors.email = "Email already registered";
        return errors;
    }

    //validation error
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(
            ({ properties }) => {
                errors[properties.path] = properties.message;
            }
        )
    }
    return errors;
}


const createToken = (id)=>{
   return jwt.sign({ id },'golden secret', {
    expiresIn:maxAge
   });
}

const loginPost = async(req, res) => {
     const { email, password } = req.body;
    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
      //  res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge * 1000});

        res.status(200).json({ success: true,token, user });
    } catch (err) {
        const errors = handleErrors(err);
        //console.log(errors);
        res.status(400).json({ success: false, errors });
    }
}

const signupPost = async (req, res) => {
    const { email, password, author } = req.body;
    try {
        const user = await User.create({ email, password, author });
        const token = createToken(user._id);
      //  res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge * 1000});

        res.status(201).json({ success: true,token, user });
    } catch (err) {
        const errors = handleErrors(err);
       // console.log(errors);
        res.status(400).json({ success: false, errors });
    }
}


const loginGet = (req, res) => {
    res.status(200).json({ success: true });

}

const signupGet = (req, res) => {
    res.status(200).json({ success: true });

}


module.exports = { loginGet, loginPost, signupGet, signupPost };