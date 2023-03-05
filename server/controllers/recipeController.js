require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require("../models/users");
const { search } = require('../routes/recipeRoutes');

const Subscriber = require("../models/Subscriber");

/**
 * GET / 
 * Homepage
 */

exports.homepage = async(req, res) => {


    try {

        const limitNum = 4;
        const categories = await Category.find({}).limit(limitNum);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNum);
        const Healthy = await Recipe.find({'category': 'Ez and Healthy'}).limit(limitNum);
        const Cheap = await Recipe.find({'category': 'Ez and Cheap'}).limit(limitNum);
        const PressureCooker = await Recipe.find({'category': 'Ez with Pressure Cooker'}).limit(limitNum);
        const SlowCooker = await Recipe.find({'category': 'Ez with Slow Cooker'}).limit(limitNum);
        const user = req.session.user;
        const food = {latest, Healthy, Cheap, PressureCooker, SlowCooker};
        if (user) {
            res.render('user-page',{title: 'EzMealz - Homepage', categories, food, user});
        } else {
            res.render('index',{title: 'EzMealz - Homepage', categories, food});
        }
        

    } catch (error) {
        res.status(500).send({message: error.message || "error occured"})
    }

    
}



exports.getRecipe = async(req, res) => {
    try {

        let recipeID = req.params.id;

        const recipe = await Recipe.findById(recipeID);
        const user = req.session.user;

        res.render('recipe', {title: 'EzMealz - Recipe', recipe,user});
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}


exports.seeRecipes = async(req, res) => {
    try {
        //replaces the "-" with spaces to query the correct categories
        let recipesID = req.params.id.replace(/-/g," ");

        const recipesByCategory = await Recipe.find({'category': recipesID});
        const user = req.session.user;
        res.render('recipes', {title: 'EzMealz - Recipes', recipesByCategory,user});
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

// POST /search
// Search

exports.search = async(req, res) => {

    //searchTerm

    try {
        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find( {$text: {$search: searchTerm, $diacriticSensitive: true}} );
        const user = req.session.user;
        res.render('search', {title: 'EzMealz - Search', recipe, user});

    }catch (error) {
        res.status(500).send({message: error.message || "Error Occurred"});
    }

}


// GET /latest-recipes

exports.latestRecipes = async(req, res) => {
    try {

        const limitNum = 10;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNum);
        const user = req.session.user;
        res.render('latestRecipes', {title: 'EzMealz - Recipe', recipe, user});
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

exports.subscribeUser = async(req, res) => {
    try {
        const user = req.session.user;
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('subscribe', {title: "subscribe", infoErrorsObj, infoSubmitObj, user});
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

exports.subscribeOnPost = async(req, res) => {

    try {
        
        const newSubscriber = new Subscriber({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            addressFirstLine: req.body.AddressFirstLine,
            addressSecondLine: req.body.AddressSecondLine,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            creditCardNumber: req.body.creditCardNumber,
            expirationDate: req.body.expDate,
            securityCode: req.body.securityCode,
        });

        

        await newSubscriber.save();
        req.flash('infoSubmit', 'You have subscribed!');
        res.redirect('/subscribe');
    } catch (error) {
        res.json(error)
        req.flash('infoErrors', error);
        res.redirect('subscribe');
    }


    
}


// GET /surprise-recipe

exports.surpriseRecipe = async(req, res) => {
    try {

        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        const user = req.session.user;

        res.render('surpriseRecipe', {title: 'EzMealz - Recipe', recipe, user});
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

exports.aboutPage = async(req, res) => {
    try {
        const user = req.session.user;
        res.render('aboutPage', {title: 'EzMealz - About', user} );
    } catch {
        res.status(500).send({message: error.message || "Error"});
    }
}


exports.contact = async(req, res) => {
    try {
        const user = req.session.user;
        res.render('contact', {title: 'EzMealz - Contact', user})
    } catch {
        res.status(500).send({message: error.message || "Error"});
    }
}





// Funcition to insert recipe catagory data into the database


// async function insertRecipeCategoryData() {

//     try{
//         await Category.insertMany([
//             {
//                 "name": "EzAndHealthy",
//                 "image": "strawberries.jpg"
//             },
        
//             {
//                 "name": "EzAndCheap",
//                 "image": "IMG_0010.jpg"
//             },
        
//             {
//                 "name": "EzWithPressureCooker",
//                 "image": "pressureCookerCard.jpg"
//             },
        
//             {
//                 "name": "EzWithSlowCooker",
//                 "image": "BbqChicken.jpg"
//             }
//         ]);
//     } catch (error) {
//         console.log('err', + error)
//     }
// }





// function that inserts recipe data into mongoDB database

// async function insertRecipeData() {

//      try{
//        await Recipe.insertMany([
//             {
//                 "name": "Sheet-Pan Sesame Tofu and Red Onions",
//                 "description": "Busy weeknight but still want to eat good? We got a recipe for you! This recipe is simple yet gourmet, utilizing the power of tofu to its fullest. Press the tofu for 15 minutes for a more firm texture!",
//                 "link": "https://cooking.nytimes.com/recipes/1023462-sheet-pan-sesame-tofu-and-red-onions",
//                 "category": "Ez and Cheap",
//                 "image": "tomatoTart.jpg"
//             },
        
//             {
//                 "name": "Sheet-Pan Gnocchi with Mushrooms and Spinach",
//                 "description": "This dish bring elegance and flavor right to your home! Pair this with a savory tart for a full complete meal, or eat on its own! It will be sure to satisfy either way.",
//                 "link": "https://cooking.nytimes.com/recipes/1022479-sheet-pan-gnocchi-with-mushrooms-and-spinach",
//                 "category": "Ez and Cheap",
//                 "image": "mushroomSpinachGnocchi.jpg"
                
//             },

//             {
//                 "name": "Creamy Chicken and Broccoli",
//                 "description": "Broccoli has a bad reputation. Change people's minds with this easy and healthy recipe!",
//                 "link": "https://healthyfitnessmeals.com/chicken-and-broccoli/",
//                 "category": "Ez and Healthy",
//                 "image": "chickenAndBroccoli.jpg"
                
//             },

//             {
//                 "name": "Sheet Pan Sausage and Veggies",
//                 "description": "Sneak in some extra vegetables with this ez and healthy sheet pan recipe!",
//                 "link": "https://www.chelseasmessyapron.com/one-pan-healthy-sausage-and-veggies/",
//                 "category": "Ez and Healthy",
//                 "image": "sheetPanSausage.jpg"
                
//             },

//             {
//                 "name": "Sheet Pan Pesto Chicken With Rice",
//                 "description": "Pesto and chicken? Can't go wrong with that! Loaded with protein and vegetables but will still satisfy the pickiest of eaters!",
//                 "link": "https://thegirlonbloor.com/sheet-pan-pesto-chicken-meal-prep-bowls/",
//                 "category": "Ez and Healthy",
//                 "image": "sheetPanPestoChicken.jpg"
                
//             },

//             {
//                 "name": "Tofu Stir Fry",
//                 "description": "Find out why tofu is a great substitute for meat with this ez and healthy recipe! Serve over rice or your favorite grain!",
//                 "link": "https://choosingchia.com/weeknight-tofu-stir-fry/",
//                 "category": "Ez and Healthy",
//                 "image": "tofuStirFry.jpg"
                
//             },

//             {
//                 "name": "Roast Chicken With Peppers, Focaccia and Basil Aioli",
//                 "description": "This meal is not as ez as the other ones, but it will be sure to satisfy. Perfect for a weekend dinner party to impress your friends and family!",
//                 "link": "https://cooking.nytimes.com/recipes/1020406-roast-chicken-with-peppers-focaccia-and-basil-aioli",
//                 "category": "Ez and Healthy",
//                 "image": "roastChicken.jpg"
                
//             },

//             {
//                 "name": "Pasta With Bacon and Peas",
//                 "description": "Basic yet delicious! Makes a quick and easy meal that is easy on the budget.",
//                 "link": "https://www.budgetbytes.com/pasta-with-bacon-and-peas/",
//                 "category": "Ez and Cheap",
//                 "image": "pastaWithBaconAndPeas.jpg"
                
//             },

//             {
//                 "name": "Ramen",
//                 "description": "Spice up your Ramen with this easy and yummy recipe!",
//                 "link": "https://pinchofyum.com/quick-homemade-ramen",
//                 "category": "Ez and Cheap",
//                 "image": "ezAndCheapRamen.jpg"
                
//             },

//             {
//                 "name": "Green Curry Glazed Tofu",
//                 "description": "This recipe is packed with flavor that goes great with tofu! Substitute chicken if tofu is not your thing.",
//                 "link": "https://cooking.nytimes.com/recipes/1023248-green-curry-glazed-tofu",
//                 "category": "Ez and Cheap",
//                 "image": "greenCurryGlazedTofu.jpg"
                
//             },

//             {
//                 "name": "Vegan Spicy Thai Tofu Tacos",
//                 "description": "This recipe is sure to please vegan and non-vegan folks alike. Easy and customizable!",
//                 "link": "https://www.jaroflemons.com/vegan-spicy-thai-tofu-tacos/",
//                 "category": "Ez and Cheap",
//                 "image": "tofuTacos.jpg"
                
//             },

//             {
//                 "name": "Honey Garlic Tofu",
//                 "description": "Easy and flavorful recipe that requires little ingredients! Sneak in some broccoli or your favorite vegetable.",
//                 "link": "https://www.walderwellness.com/honey-garlic-tofu-soy-sesame/",
//                 "category": "Ez and Cheap",
//                 "image": "honeyGarlicTofu.jpg"
                
//             },

//             {
//                 "name": "Baked Brie",
//                 "description": "This easy and simple dish will make your taste buds dance with flavor! Pairs nicely with your favorite crackers and breads.",
//                 "link": "https://www.provecho.bio/@yessidothecookingg/baked-brie",
//                 "category": "Ez and Cheap",
//                 "image": "bakedBrie.jpg"
                
//             },

//             {
//                 "name": "Tofu Tikka Masala",
//                 "description": "Tofu makes an excellent protein alternative to chicken in this easy and healthy recipe! Pair with brown rice and veggies for a fuller meal.",
//                 "link": "https://www.cookwithmanali.com/tofu-tikka-masala/",
//                 "category": "Ez and Healthy",
//                 "image": "tofuTikkaMasala.jpg"
                
//             },

//             {
//                 "name": "Crispy Mushroom Focaccia",
//                 "description": "Ez, delicious, and uses many ingredients that are on hand! How could we not include it.",
//                 "link": "https://cooking.nytimes.com/recipes/1021818-crispy-mushroom-focaccia",
//                 "category": "Ez and Cheap",
//                 "image": "mushroomFoccicia.jpg"
                
//             },

//             {
//                 "name": "Instant Pot Pasta Cajun Chicken Alfredo",
//                 "description": "Perfect for the busy weeknight. Flavorful and rich, let your pressure cooker do most of the work!",
//                 "link": "https://www.number-2-pencil.com/instant-pot-pasta-cajun-chicken-alfredo/",
//                 "category": "Ez with Pressure Cooker",
//                 "image": "cajunPasta.jpg"
                
//             },

//             {
//                 "name": "Instant Pot Italian Pot Roast",
//                 "description": "Discover the wonders that a pressure cooker can do with this recipe!",
//                 "link": "https://oursaltykitchen.com/instant-pot-pot-roast/",
//                 "category": "Ez with Pressure Cooker",
//                 "image": "instantPotRoast.jpg"
                
//             },

//             {
//                 "name": "Instant Pot Pork Stew",
//                 "description": "Impress that special someone with this flavorful and rich recipe! Your pressure cooker won't mind you taking all the credit.",
//                 "link": "https://cooking.nytimes.com/recipes/1022659-instant-pot-pork-stew-with-red-wine-and-olives",
//                 "category": "Ez with Pressure Cooker",
//                 "image": "instantPotPork.jpg"
                
//             },

//             {
//                 "name": "Chickpea Coconut Curry",
//                 "description": "Serve this dish over your favorite grain for a full and complete meal! Or serve by itself, it will be sure to please either way.",
//                 "link": "https://www.indianveggiedelight.com/chickpea-coconut-curry-instant-pot/",
//                 "category": "Ez with Pressure Cooker",
//                 "image": "coconutCurry.jpg"
                
//             },


//             {
//                 "name": "Slow-Cooker Chicken Tortellini Tomato Soup",
//                 "description": "This recipe is simple yet delicious, it feels like cheating! Discover the power of slow cookers with this recipe.",
//                 "link": "https://cooking.nytimes.com/recipes/1020481-slow-cooker-chicken-tortellini-tomato-soup",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "tortelliniSoup.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker Pozole",
//                 "description": "Discover why pozole is a renowned recipe within the Mexican culture! Impress your friends with the simple and yummy recipe!",
//                 "link": "https://www.tasteofhome.com/recipes/slow-cooker-pork-pozole/",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "slowCookerPozole.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker Creamy Gnocchi Soup",
//                 "description": "Perfect flavor that will warm any soul.",
//                 "link": "https://www.delish.com/cooking/recipe-ideas/a29416622/slow-cooker-creamy-gnocchi-soup-recipe/",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "creamyGnocciSoup.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker kung Pao Chicken",
//                 "description": "This dish is flavorful on its own, but feel free to add your favorite toppings like peanuts or vegetables! ",
//                 "link": "https://therecipecritic.com/skinny-slow-cooker-kung-pao-chicken/",
//                 "category": "Ez with Slow Cooker",
//                 "image": "kungPaoChicken.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker BBQ Chicken",
//                 "description": "Make this during your next cook out and impress your friends and family! Ez and delicious, we have to include it.",
//                 "link": "https://www.familyfreshmeals.com/2014/06/best-crockpot-bbq-chicken.html",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "BbqChicken.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker Lasagna",
//                 "description": "I know, I was skeptical at first too. Now, I wouldn't make lasagna any other way.",
//                 "link": "https://fitfoodiefinds.com/crock-pot-lasagna/",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "crockPotLasagna1.jpg"
                
//             },

//             {
//                 "name": "Slow-Cooker White Chicken Chili",
//                 "description": "Looking for a hearty and healthy meal? Look no further! Packed with flavor and takes minimum effort.",
//                 "link": "https://www.delish.com/cooking/recipe-ideas/a25648007/crockpot-white-chicken-chili-recipe/",
//                 "category": "Ez with Slow-Cooker",
//                 "image": "whiteChickenChili.jpg"
                
//             },


//      ]);
//     } catch (error) {
//        console.log('err', + error)
//     }
// }

// insertRecipeData();

// GET /recipes/:id

