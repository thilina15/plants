const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const app = express();

//require routes
const homePage = require('./routes/home')


//app config
app.set('view engine' , 'ejs')
app.set('layout' ,'layouts/layout')
app.use(expressEjsLayouts)

app.use('/',homePage);
app.listen(process.env.PORT||3000);