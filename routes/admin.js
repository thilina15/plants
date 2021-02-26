const express = require('express')
const router = express.Router()
const admin = require('../models/admin')
const product = require('../models/product')
const {adminAuth} = require('../auth/adminAuth')


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

//update image
function updateImage(product, imageEncoded,position){
    if(imageEncoded==null) return
    try{
        const image = JSON.parse(imageEncoded) //covert encoded string to json format
        if(image!=null){
            const imag = new Buffer.from(image.data , 'base64') //image objects' data field -> buffer (in databse image save as a buffer)
            const imageType = image.type 
            if(position==0){
                product.images[0] = {image:imag, imageType: imageType} 
            }
            else if(position==1){
                product.images[1] = {image:imag, imageType: imageType}
            }
            else{
                if(product.images[1]==null){
                    product.images[1] = {image:imag, imageType: imageType}
                }else{
                    product.images[2] = {image:imag, imageType: imageType}
                }
            }
        }
    }catch(er){
        return
    }
    
}
//dashboard
router.get('/',(req,res)=>{
    res.redirect('/admin/dashboard')
})

//login page
router.get('/login',(req,res)=>{
    res.render('admin/login')
})

//gallery
router.get('/gallery',adminAuth,async(req,res)=>{
    var pros = await product.find()
    res.render('admin/gallery',{products:pros})
})

//product edit
router.get('/gallery/:id',adminAuth,async(req,res)=>{
    var pro = await product.findById(req.params.id)
    res.render('admin/product',{product:pro})
})

router.post('/product/:id',async(req,res)=>{
    var productOB = await product.findById(req.params.id)
    productOB.name = req.body.name
    productOB.description = req.body.description
    productOB.price = req.body.price
    productOB.size = {small:req.body.small, medium: req.body.medium, large: req.body.large}
    productOB.category = req.body.category
    updateImage(productOB,req.body.image1,0)
    updateImage(productOB,req.body.image2,1)
    updateImage(productOB,req.body.image3,2)
    await productOB.save()
    res.redirect('/admin/gallery')
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
    res.redirect('/admin/gallery')
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