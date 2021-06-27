const express = require('express')
const router = express.Router()
const user = require('../models/user')
const cart = require('../models/cart')
const {userAuth} = require('../auth/userAuth') 
const order = require('../models/order')
const { findById } = require('../models/user')

//place order
router.post('/',userAuth,async(req,res)=>{
    const userOB = await user.findOne({_id:req.session.user._id})
    var orderOB = new order({
        user:req.session.user._id,
        address:{
            name:req.body.Name,
            address1st:req.body.Address1st,
            address2nd:req.body.Address2nd,
            mobile:req.body.Mobile
        }
    })
    var cartOB = await cart.findById(userOB.cart)
    console.log(cartOB)
})

module.exports = router