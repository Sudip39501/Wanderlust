const Listing = require("./models/Listing.js");
const Review = require("./models/Review.js");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");


module.exports.isLogin= (req,res,next)=>{
    console.log(req.originalUrl);
    console.log("-------");
    if(!req.isAuthenticated()){
        req.session.currUrl = req.originalUrl;
        req.flash("error" , "you must be logged in frist");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.currUrl;  
    next();
};


module.exports.isOwner = async(req,res, next) =>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res, next) =>{
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
  
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have permission to delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error}= listingSchema.validate(req.body);
   
   if(error){
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(404, errMsg);
   }else{
    next();
   }
}

module.exports.validateReview = (req,res,next) =>{
    let {error}= reviewSchema.validate(req.body);
   
   if(error){
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(404, errMsg);
   }else{
    next();
   }
}
