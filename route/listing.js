const express = require("express");
const multer = require("multer");
const router = express.Router();
const wrapAsync = require("../Utils/asyncWrap.js");
const Listing = require("../models/Listing.js");
const {isLogin, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage });

router.route("/")
//index
.get(listingController.index)
//create
.post(upload.single('listing[image]')
,isLogin
,validateListing
,listingController.createListing);



//new route
router.get("/new",isLogin,listingController.newFrom);

router.route("/:id")
.get(listingController.showListing)
.put(isLogin,isOwner,upload.single('listing[image]'),validateListing,listingController.updateListing)
.delete(isLogin,isOwner,listingController.destroyListing)

//Edit route
router.get("/:id/edit",isLogin,isOwner,listingController.editListing);


module.exports= router;