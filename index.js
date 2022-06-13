const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);
//for overriding the post method to put/delete
const methodOverride = require("method-override");
const flash = require('connect-flash');
var csrf = require('csurf');

let port = process.env.PORT || 3000;

const req = require("express/lib/request");

// let csrfProtection = csrf();

//Bodyparser middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

//to make public folder static using express and path module
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

//for MongoDB compass local database we use 
// const MONGODB_URI = "mongodb://localhost:27017/College_App";


//to connect MongoDB_URI that we mentioned in the .env file
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true,useUnifiedTopology: true})
        .then(() => {
            console.log("Hurry,MongoDB Atlas connected!!");
            })
        .catch((err) => {
            console.log(err);
            });
       
//to save the session details in the MongoDB
const store = new MongoDBStore({uri: process.env.MONGODB_URI, collection: 'Sessions'});

//for creating a session using exress-session here
app.use(session({secret: "my secret", resave: false, saveUninitialized: false,store: store }));


// middleware for flash messages
app.use(flash());
// app.use(csrfProtection);

//to use isLoggedIn,admin,,username,etc... locally
app.use((req,res,next)=>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    if(req.session.user){
        res.locals.username =req.session.user.username;
        res.locals.admin=req.session.user.admin;
        res.locals.email=req.session.user.email;
    }
    else{
        res.locals.username =null;
        res.locals.admin=null;
        res.locals.email=null;
    }
    next();
})

app.get("/",(req,res) => {
    res.redirect("/home");
});

const authRoutes = require("./routes/auth");
const Tag = require("./routes/tags");
const questions = require("./routes/questions");
const create = require("./routes/create");

app.use(authRoutes);
app.use(Tag);
app.use(questions);
app.use(create);


app.listen(port,function(err){
    if(err)
    console.log("Unable to connect server");
    else
    console.log("Hurry,Server connected!!");
});




