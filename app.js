/* Going to be brain of application. Including dependincies here.*/

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const SECRET = process.env.SECRET || "secret"
const session = require("express-session"); // create session cookies
const connect = require("connect-mongodb-session")(session) // store cookies in mongo
const methodOverride = require("method-override"); //Lets use PUT or DELETE in places where client does not allow
const morgan = require("morgan"); //request logger middleware for node.js
const cors = require("cors");
const port = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('dotenv').config();

// allows to pass url encoded bodies
app.use(express.urlencoded({extended:true}));
// use for convienence for calling public items such as images
app.use(express.static('public'));
app.use(expressLayouts);

//prevents cors errors 
app.use(cors()); 
//swaps method requests with _method query
app.use(methodOverride("_method"));

app.use(morgan("tiny")); // Logs requests
app.use(express.json()); // Parse json bodies

// place where layouts will be stored
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', './views')

app.use(cookieParser('EzMealzSecure'));


app.use(
    session({
      secret: SECRET,
      saveUninitialized: true, // don't create session until something stored
      resave: true, //don't save session if unmodified
      store: new connect({ 
        uri: process.env.MONGODB_URI,
        
        collection: "sessions"
       }),
    })
  );

app.use(flash());


const routes = require('./server/routes/recipeRoutes.js');

app.use('/', routes);



app.listen(port, () => console.log(`listening to port ${port}`));

