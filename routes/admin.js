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
router.get('/login',async(req,res)=>{
    var ob = await admin.findOne()
    if(ob){
        res.render('admin/login',{admin:true})
        console.log('admin have')
    }else{
        console.log('admin not have')
        res.render('admin/login',{admin:false})
    }
    
})

//gallery
router.get('/gallery',adminAuth,async(req,res)=>{
    var pros = await product.find({active:true})
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
    productOB.promotion=req.body.promotion
    productOB.oldPrice = req.body.oldPrice
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

//admin account
router.get('/dashboard',adminAuth,async(req,res)=>{
    var ob = await admin.findOne()
    res.render('admin/account',{admin:ob})
})

//admin logout
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login')
})

//admin register
router.post('/register',async(req,res)=>{
    var ob = new admin({
        userName:req.body.userName,
        password:req.body.password
    })
    try{
        await ob.save()
        var message='new admin created'
        res.redirect('/admin/login/?success='+message)
    }catch(e){
        var message='can not create admin. try again'
        res.redirect('/admin/login/?error='+message)
    }
})

//admin login logic
router.post('/login',async(req,res)=>{
    try{
        const adminOB = await admin.findOne({userName:req.body.userName, password:req.body.password})
        if(adminOB){
            req.session.userType="plantasyAdmin"
            res.redirect('/order/all')
        }else{
            var messsage='invalid login details'
            res.redirect('/admin/login/?error='+messsage)
        }
    }
    catch(err){
        res.locals.error='invalid login details'
        res.render('admin/login')
    }  
})

//update admin account details
router.post('/',async(req,res)=>{
    var ob = await admin.findOne()
    if(ob.password==req.body.oldPassword & req.body.newPassword==req.body.confirmPassword)
    {
        ob.userName = req.body.userName,
        ob.password=req.body.newPassword
        await ob.save()
        var message = 'admin details updated..'
        res.redirect('/admin/dashboard/?success='+message)
    }else{
        var message = 'admin details updated..'
        res.redirect('/admin/dashboard/?error='+message)
    }
})

//remove product
router.get('/removeproduct/:id',async(req,res)=>{
    var ob = await product.findById(req.params.id)
    ob.active=false
    await ob.save()
    res.redirect('/admin/gallery')
})

module.exports = router