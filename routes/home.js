const express = require('express')
const order = require('../models/order')
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
    var items = await product.find({active:true})
    res.render('index/gallery',{products:items,searchKey:'', category:'all'})
})

router.get('/gallery/:id',userAuth,async(req,res)=>{
    const proOB = await product.findById(req.params.id)
    if(proOB){
        res.render('index/product',{product:proOB})    
    }else{
        res.redirect('/')
    }
    
})

router.get('/feedbacks',async(req,res)=>{
    var ob = await order.find({feedBackDone:true}).populate('user')
    console.log(ob)
    res.render('feedbacks',{orders:ob})
})

router.post('/search',async(req,res)=>{
    var category=req.body.category
    if(req.body.category=='all'){
        category = new RegExp('p','i')
    }
    var productName=''
    if(req.body.keyword!=null && req.body.keyword!==''){
        productName= new RegExp(req.body.keyword, 'i')
        var items = await product.find({name:productName, active:true,category:category})
        res.render('index/gallery',{products:items, searchKey:req.body.keyword , category:req.body.category})
    }else{
        var items = await product.find({active:true,category:category})
        res.render('index/gallery',{products:items,searchKey:'', category:req.body.category})
    }

})

//pramotions 
router.get('/promotions',async(req,res)=>{
    var ob = await product.find({active:true,promotion:'on'})
    res.render('index/promotions',{products:ob})
})

module.exports =router;