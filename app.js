if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = process.env.ATLUS_DB_URL;
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User.js");
const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require ("./route/user.js")


//connection to the database
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname , "views"));
app.engine("ejs" ,ejsMate);

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24*60*60,
    crypto:{
        secret: process.env.SECRET ,
    }
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
});

const  sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 *24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log("USER:", req.user);
  next();
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.get("/check-session", (req, res) => {
  console.log(req.session);   // full session object
  res.send(req.session);
});



app.use("/listings" , listingRouter);
app.use("/listings/:id/review" , reviewRouter);
app.use("/", userRouter);




// 404 handler
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
    let{status , message} = err;
    res.render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("app is listening to the port 8080");
})