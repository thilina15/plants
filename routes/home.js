const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('index/homePage')
})

router.get('/gallery',(req,res)=>{
    res.render('index/gallery')
})

router.get('/gallery/:id',(req,res)=>{
    res.render('index/product')
})

module.exports =router;