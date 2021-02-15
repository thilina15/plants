const express = require('express')
const router = express.Router()
const product = require('../models/product')


router.get('/', (req,res)=>{
    res.render('index/homePage')
})

router.get('/gallery',async(req,res)=>{
    var items = await product.find({})
    res.render('index/gallery',{products:items})
})

router.get('/gallery/:id',(req,res)=>{
    res.render('index/product')
})

module.exports =router;