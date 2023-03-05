//library for hashing passwords
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const Subscriber = require('../models/Subscriber');
//controller for creating new users
const getCreateUser = (req, res) => {
    try {
        res.render('auth/create-user', {title: 'EzMealz - Create User'} );
    } catch {
        res.status(500).send({message: error.message || "Error"});
    }
}
//controller for submitting new users
const getSubmitUser = async(req, res) => {
    //salt password for extra security incase two users use the same password
    //adds random string to the end of password to make passwords more unique
    const salt = await bcrypt.genSalt(5);
    //hash the password after salting
    req.body.password = await bcrypt.hash(req.body.password, salt);
    //create the new user
    const user = await User.create(req.body);
    console.log(user);
    //redirect back to login after creating user
    res.redirect("/auth/login");
}

//controller for login page
const getLogin = (req, res) => {
    res.render("auth/login");
}
//controller for logging in 
const loginSubmit = async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if (user) {
            //compares if the inputted password from login page is the same as the user password from the database
            const result = await bcrypt.compare(req.body.password, user.password)
            if(result) {
                req.session.user = user.username
                try {

                    const limitNum = 4;
                    const categories = await Category.find({}).limit(limitNum);
                    const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNum);
                    const Healthy = await Recipe.find({'category': 'Ez and Healthy'}).limit(limitNum);
                    const Cheap = await Recipe.find({'category': 'Ez and Cheap'}).limit(limitNum);
                    const PressureCooker = await Recipe.find({'category': 'Ez with Pressure Cooker'}).limit(limitNum);
                    const SlowCooker = await Recipe.find({'category': 'Ez with Slow Cooker'}).limit(limitNum);
                    const user = await req.session.user;
                    const food = {latest, Healthy, Cheap, PressureCooker, SlowCooker};
                    console.log(user.username)
                    res.render('user-page',{title: 'EzMealz - user-page', categories, food, user});
            
                } catch (error) {
                    res.status(500).send({message: error.message || "error occured"})
                }
    
            } else {
                res.status(400).json({error: "Incorrect password"})
            }
        } else {
            res.status(400).json({error: "No user has that name"})
        }
    }catch (error) {
        res.json(error)
    }
}

const userHomepage = async(req, res) => {


    try {

        const limitNum = 4;
        const categories = await Category.find({}).limit(limitNum);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNum);
        const Healthy = await Recipe.find({'category': 'Ez and Healthy'}).limit(limitNum);
        const Cheap = await Recipe.find({'category': 'Ez and Cheap'}).limit(limitNum);
        const PressureCooker = await Recipe.find({'category': 'Ez with Pressure Cooker'}).limit(limitNum);
        const SlowCooker = await Recipe.find({'category': 'Ez with Slow Cooker'}).limit(limitNum);
        const user = await req.session.user;
        const food = {latest, Healthy, Cheap, PressureCooker, SlowCooker};
        console.log(user.username)
        res.render('user-page',{title: 'EzMealz - user-page', categories, food, user});

    } catch (error) {
        res.status(500).send({message: error.message || "error occured"})
    }

    
}

exports.userNav = async(req, res) => {
    try {
        const user = req.session.user;
        res.render('main', user)
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

const getSubscribers = async(req, res) => {
    try {
        const subscribers = await Subscriber.find({});
        res.json(subscribers);
    } catch (error) {
        res.status(500).send({message: error.message || "Error"});
    }
}

//log out route
const logout = (req, res) => {
    //destroy the session
    req.session.destroy();
    res.redirect("/")
}
const authActions = {
    getCreateUser,
    getSubmitUser,
    getLogin,
    loginSubmit,
    logout,
    userHomepage,
    getSubscribers
}

module.exports = authActions;