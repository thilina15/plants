const express = require('express')
const router = express.Router()
const user = require('../models/user')

//user auth
function userAuth(req,res,next){
    if(req.session.user=="user"){
        next()
    }else{
        res.redirect('/user/login')
    }
}

router.get('/signup',(req,res)=>{
    res.render('user/signUp')
})

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login',async(req,res)=>{
    try{
        const userOB = await user.findOne({userName:req.body.userName, password:req.body.password})
        if(userOB){
            req.session.user="user"
            res.render('user/dashboard')
        }else{
            res.redirect('/')
        }
    }catch{
        res.redirect('/')
    }
})


module.exports = router