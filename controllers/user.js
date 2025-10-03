const User = require("../models/User.js")
const wrap = require("../Utils/flashWrap.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");


module.exports.renderSignupForm =  (req,res) =>{
    res.render("user/user.ejs");
}

module.exports.singup = wrap("/signup" ,async(req, res)=>{
    let { username , email , password} = req.body;
    const newUser = new User({email , username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser ,(err)=>{
        if(err){
            next(err);
        }
    req.flash("success" , "you are register and login successfully");
    return res.redirect("/listings");
    });
  })

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = (req,res)=>{
    console.log(req.session);
     req.flash("success","Welcome to wounderlust you are login ");
     let redirectUrl = res.locals.redirectUrl || "/listings";
     if(redirectUrl.includes("/review")){
        const match = redirectUrl.match(/\/listings\/([^/]+)/);
        if (match) redirectUrl = `/listings/${match[1]}`;
     } // this is the thing i have to study
     res.redirect(redirectUrl); //this path create a problem you we are not login but still want to delte a review.(beacuse there is no get route for  /listings/:id/review/:reviewId) so it is show page not found
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    req.flash("success" , "you are logout");
    res.redirect("/listings");
});
}