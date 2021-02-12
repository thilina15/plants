const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('indexViews/homePage')
})

router.get('/gallery',(req,res)=>{
    res.render('indexViews/gallery')
})


module.exports =router;