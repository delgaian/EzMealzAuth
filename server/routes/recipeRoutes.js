const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App routes linked to recipe controlller 
 */
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.getRecipe);
router.get('/recipes/:id', recipeController.seeRecipes);
router.post('/search', recipeController.search);
router.get('/latest-recipes', recipeController.latestRecipes);
router.get('/surprise-recipe', recipeController.surpriseRecipe);
router.get('/about', recipeController.aboutPage);
router.get('/contact', recipeController.contact);

module.exports = router;
