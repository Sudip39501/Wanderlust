const Listing = require("../models/Listing");
const Review = require("../models/Review");


module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    if(!listing){
        req.flash("error" , "Listing is not found in the database!");
        return res.redirect(`/listings/${listing._id}`);
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success" ,"New review is created!");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    console.log("Listing ID:", id);
    console.log("Review ID:", reviewId);
    let listing = await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    let review = await Review.findByIdAndDelete(reviewId);
    if(!listing || !review){
        // throw(new ExpressError(404, "Id not found in Database"));
        req.flash("error" , "id is not found in the database");
        return res.redirect(`/listings/${id}`)

    }
    req.flash("success" ,"Review is Deleted successfully!");
    
    res.redirect(`/listings/${id}`)
}