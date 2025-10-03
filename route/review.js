const express = require("express");
const router = express.Router({mergeParams:true});
// const wrapAsync = require("../Utils/asyncWrap.js");
const Review = require("../models/Review");
const Listing = require("../models/Listing.js");
const { validateReview, isLogin, isReviewAuthor} = require("../middleware.js");
const reviewContorler = require("../controllers/review.js")

//create review
router.post("/" ,isLogin,validateReview,reviewContorler.createReview);

//delete review
router.delete("/:reviewId",isLogin,isReviewAuthor,reviewContorler.destroyReview);

module.exports = router;
