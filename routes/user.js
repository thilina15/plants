const express = require('express')
const router = express.Router()
const user = require('../models/user')

//user auth
function userAuth(req,res,next){
    if(req.session.user!=null){
        const userOB = req.session.user
        res.locals.user=userOB
        next()
    }else{
        res.redirect('/user/login')
    }
}

//sign up 
router.get('/signup',(req,res)=>{
    res.render('user/signUp')
})

router.post('/signup',async(req,res)=>{
    var testOB = await user.findOne({email:req.body.email})
    if(testOB){
        res.redirect('/')
    }
    else{
        var userOB = new user({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            address1st:req.body.address1st,
            address2nd:req.body.address2nd,
            email:req.body.email,
            mobile:req.body.mobile,
            password:req.body.password
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

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login',async(req,res)=>{
    try{
        const userOB = await user.findOne({email:req.body.email, password:req.body.password})
        if(userOB){
            req.session.user=userOB
            res.redirect('/user/dashboard')
        }else{
            res.redirect('/')
        }
    }catch{
        res.redirect('/')
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.get('/dashboard',userAuth,(req,res)=>{
    res.render('user/dashboard')
})

module.exports = router