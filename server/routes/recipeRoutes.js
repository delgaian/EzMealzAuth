const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');
const User = require("../models/users");
const AuthRouter = require("./AuthRouter.js");
const auth = require("../../views/auth/auth.js");
/**
 * App routes linked to recipe controlller 
 */

// Auth middleware

router.use('/auth', AuthRouter)

router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.getRecipe);
router.get('/recipes/:id', recipeController.seeRecipes);
router.post('/search', recipeController.search);
router.get('/latest-recipes', recipeController.latestRecipes);
router.get('/surprise-recipe', recipeController.surpriseRecipe);
router.get('/about', recipeController.aboutPage);
router.get('/contact', recipeController.contact);
router.get('/subscribe', recipeController.subscribeUser);

router.post('/subscribe', recipeController.subscribeOnPost);



module.exports = router;
