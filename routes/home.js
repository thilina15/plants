const express = require('express')
const router = express.Router()
const product = require('../models/product')

//user auth
function userAuth(req,res,next){
    if(req.session.user!=null){
        const uOB = req.session.user
        res.locals.user=uOB
        next()
    }else{
        res.locals.user=null
        next()
    }
}

router.get('/', userAuth,(req,res)=>{
    res.locals.home=true
    res.render('index/homePage')
})

router.get('/gallery',userAuth,async(req,res)=>{
    var items = await product.find({})
    res.render('index/gallery',{products:items})
})

router.get('/gallery/:id',userAuth,async(req,res)=>{
    const proOB = await product.findById(req.params.id)
    if(proOB){
        res.render('index/product',{product:proOB})    
    }else{
        res.redirect('/')
    }
    
})

module.exports =router;