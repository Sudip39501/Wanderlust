const express = require("express");
const router = express.Router();
const User = require("../models/User.js")
const wrap = require("../Utils/flashWrap.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")


router.route("/signup")
.get(userController.renderSignupForm)
.post( userController.singup);

router.route("/login")
.get(userController.renderLoginForm)
.post(redirectUrl,
    passport.authenticate("local", {
    failureRedirect: '/login' ,
    failureFlash: true
}) , userController.login)


router.get("/logout" , userController.logout);

module.exports = router;