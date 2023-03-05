const express = require('express');
const router = express.Router();

const auth = require("../../views/auth/auth.js");

const adminAuth = require("../../views/auth/adminAuth.js");

const AuthController = require("../controllers/authController.js")
// Auth Router routes
router.get("/", (req,res) => {
    res.send("Auth")
});

//Create page
router.get("/create-user", AuthController.getCreateUser)

//create submit user
router.post("/create-user", AuthController.getSubmitUser)

//login page
router.get("/login", AuthController.getLogin);

//Login submit
router.post("/user-profile", AuthController.loginSubmit);

//log out route
router.get("/logout", AuthController.logout);

router.get("/user-profile", auth, AuthController.userHomepage);

router.get("/view-subscribers", adminAuth, AuthController.getSubscribers);

module.exports = router;