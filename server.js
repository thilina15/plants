if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()   
}

const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const {v4: uuidv4} = require('uuid')

// const admin = require('./models/admin')

//require routes
const homePage = require('./routes/home')
const adminPage = require('./routes/admin')
const user = require('./routes/user')
const cart = require('./routes/cart')
const order = require('./routes/order')
const report = require('./routes/report')


//app config
app.set('view engine' , 'ejs')
app.set('layout' ,'layouts/layout')
app.use(expressEjsLayouts)
app.use('/public',express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

//session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))


//databse connection
mongoose.connect(process.env.DATABSE_URL_LOCAL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
    useCreateIndex: true}) 
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=> console.log('connected to mongoose')) 


//setup local user
app.use((req,res,next)=>{

    if(req.query.error){
        res.locals.error=req.query.error
    }
    if(req.query.success){
        res.locals.success=req.query.success
    }

    res.locals.userType = req.session.userType
    if(req.session.user!=null){
        const userOB = req.session.user
        res.locals.user=userOB
    }
    next()
})

app.use('/',homePage);
app.use('/admin',adminPage)
app.use('/user',user)
app.use('/cart',cart)
app.use('/order',order)
app.use('/report',report)

app.listen(process.env.PORT||3000); 