const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const connectDB = require("./db/connect");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const blog_routes = require("./routes/blog_routes");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())



app.get("/",function(req,res){
 res.sendFile(__dirname + "/index.html");
})

app.use("/api/blog",blog_routes);


const start = async function(){
try {
   await connectDB(process.env.MONGODB_URL);
    app.listen( PORT ,function(){
    console.log('  Listening on port '+ PORT);
})
} catch (error) {
    console.log(error);
}

}


start();

