const express = require('express')
const router = express.Router()
const user = require('../models/user')
const cart = require('../models/cart')
const {userAuth} = require('../auth/userAuth') 


//sign up 
router.get('/signup',(req,res)=>{
    res.render('user/signUp')
})

router.post('/signup',async(req,res)=>{
    var testOB = await user.findOne({email:req.body.email})
    if(testOB){
        res.locals.error = "email allready used.. cannot sign up"
        res.render('user/signup')
    }
    else{
        var cartOB = new cart()
        const savedCart = await cartOB.save()
        var userOB = new user({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            address1st:req.body.address1st,
            address2nd:req.body.address2nd,
            email:req.body.email,
            mobile:req.body.mobile,
            password:req.body.password,
            cart:savedCart.id
        })
        try{
            await userOB.save()
            res.redirect('/user/login')
        }catch(err){
            res.redirect('/')
            console.log(err)
        }
    }
    
    
})

//login
router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login',async(req,res)=>{
    try{
        const userOB = await user.findOne({email:req.body.email, password:req.body.password})
        if(userOB){
            req.session.userType='user'
            req.session.user=userOB
            res.redirect('/user/dashboard')
        }else{
            res.redirect('/')
        }
    }catch{ 
        res.redirect('/')
    }
})

//log out user
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

//show dashboard user
router.get('/dashboard',userAuth,(req,res)=>{
    res.render('user/dashboard')
})

module.exports = router