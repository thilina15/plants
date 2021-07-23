if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}

const express = require('express')
const router = express.Router()
const user = require('../models/user')
const cart = require('../models/cart')
const {userAuth} = require('../auth/userAuth') 
const {transpoter} = require('../auth/email')







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
// configure mail options
        var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Welcome to Plantasy',
            text:'hello '+req.body.firstName+', \n \n Thank you for register with us.. \n \n Plantasy Team.'
        }

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
            console.log('started')
            transpoter.sendMail(mailOptions,(err,info)=>{
                if(err){
                    var message = 'user registered but there is a problem with sending Email..'
                    res.redirect('/user/login/?success='+message)
                }else{
                    console.log('no error')
                    var message = 'user registered'
                    res.redirect('/user/login/?success='+message)
                }
            })
            console.log('out')
        }catch(err){
            var message = 'user can not register'
            res.redirect('/user/signup/?error='+message)
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
            var messsage='invalid user'
            res.redirect('/user/login/?error='+messsage)
        }
    }catch{ 
        var messsage='invalid user'
        res.redirect('/user/login/?error='+messsage)
    }
})

//log out user
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

//show dashboard user
router.get('/dashboard',userAuth,async(req,res)=>{
    var userob = await user.findById(req.session.user._id)
    res.render('user/dashboard',{user:userob})
})

//profile update
router.post('/profileUpdate',async(req,res)=>{
    var userOB = await user.findById(req.session.user._id)
    userOB.firstName=req.body.firstName
    userOB.lastName=req.body.lastName
    userOB.address1st=req.body.address1st
    userOB.address2nd=req.body.address2nd
    userOB.email=req.body.email
    userOB.mobile=req.body.mobile
    try{
        await userOB.save()
        var message = 'account details updated..'
        res.redirect('/user/dashboard/?success='+message)
    }catch(er){
        var messsage='invalid details'
        res.redirect('/user/dashboard/?error='+messsage)
    }
    
})

//password update
router.post('/passwordUpdate',async(req,res)=>{
    var userOB = await user.findById(req.session.user._id)
    if(req.body.oldPassword==userOB.password && req.body.newPassword==req.body.confirmPassword)
    {
        userOB.password=req.body.newPassword
        await userOB.save()
        var message = 'account details updated..'
        res.redirect('/user/dashboard/?success='+message)
    }
    else{
        var messsage='invalid details'
        res.redirect('/user/dashboard/?error='+messsage)
    }
    
})

module.exports = router