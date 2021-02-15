const express = require('express')
const router = express.Router()
const admin = require('../models/admin')
const product = require('../models/product')

//admin auth
function adminAuth(req,res,next){
    if(req.session.admin!=='plantasyAdmin'){
        res.redirect('/admin/login')
    }else{
        res.locals.admin=true
        next()
    }
}

//save image
function saveImage(product, imageEncoded){
    if(imageEncoded==null) return
    try{
        const image = JSON.parse(imageEncoded) //covert encoded string to json format
        if(image!=null){
            const imag = new Buffer.from(image.data , 'base64') //image objects' data field -> buffer (in databse image save as a buffer)
            const imageType = image.type 
            product.images.push({image:imag, imageType: imageType})
        }
    }catch(er){
        return
    }
    
}

router.get('/login',(req,res)=>{
    res.render('admin/login')
})

router.get('/gallery',adminAuth,(req,res)=>{
    res.render('admin/gallery')
})

//add products
router.get('/new',adminAuth,(req,res)=>{
    res.render('admin/addProduct')
})

router.post('/new',adminAuth,async(req,res)=>{
    var item = new product()
    item.name = req.body.name
    item.description = req.body.description
    item.price = req.body.price
    item.size = {small:req.body.small, medium: req.body.medium, large:req.body.large}
    item.category=req.body.category
    saveImage(item,req.body.image1)
    saveImage(item,req.body.image2)
    saveImage(item,req.body.image3)
    await item.save()
    //console.log(req.body)
    res.render('admin/gallery')
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