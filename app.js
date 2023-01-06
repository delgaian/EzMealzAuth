/* Going to be brain of application. Including dependincies here.*/

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 4000;

require('dotenv').config();

// allows to pass url encoded bodies
app.use(express.urlencoded({extended:true}));
// use for convienence for calling public items such as images
app.use(express.static('public'));
app.use(expressLayouts);
// place where layouts will be stored
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', './views')

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`listening to port ${port}`));