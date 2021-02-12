const express = require('express')
const router = express.Router()
const admin = require('../models/admin')

//admin auth
function adminAuth(req,res,next){
    if(req.session.admin!=='plantasyAdmin'){
        res.redirect('/admin/login')
    }else{
        res.locals.admin=true
        next()
    }
}


router.get('/login',(req,res)=>{
    res.render('admin/login')
})

router.get('/gallery',adminAuth,(req,res)=>{
    res.render('admin/gallery')
})

router.get('/new',adminAuth,async(req,res)=>{
    res.render('admin/addProduct')
})

router.get('/dashboard',adminAuth,(req,res)=>{
    res.render('admin/account')
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login')
})

router.post('/login',async(req,res)=>{
    try{
        const adminOB = await admin.findOne({userName:req.body.userName, password:req.body.password})
        if(adminOB){
            req.session.admin="plantasyAdmin"
            res.redirect('/admin/dashboard')
        }else{
            res.locals.error='invalid login details'
            res.render('admin/login')
        }
    }
    catch(err){
        res.locals.error='invalid login details'
        res.render('admin/login')
    }  
})

module.exports = router