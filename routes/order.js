const express = require('express')
const router = express.Router()
const user = require('../models/user')
const cart = require('../models/cart')
const {userAuth} = require('../auth/userAuth') 
const order = require('../models/order')
const { findById } = require('../models/user')


//place order
router.post('/',userAuth,async(req,res)=>{
    console.log(req.body.name) 
    const name = req.body.name
    const ad1 = req.body.address1st
    const ad2 = req.body.address2nd
    const tel = req.body.mobile
    const userOB = await user.findOne({_id:req.session.user._id})
    var orderOB = new order({
        user:req.session.user._id,
        address:{
            name:name,
            address1st:ad1,
            address2nd:ad2,
            mobile:tel
        }
    })
    var cartOB = await cart.findById(userOB.cart).populate({
        path:'items.product',
        model:'product'
    })
    orderOB.items = cartOB.items
    var total= cartOB.total
    orderOB.total=total
    await orderOB.save()
    cartOB.items=[]
    await cartOB.save()
    res.redirect('/order/user')
})

//view all orders (user)
router.get('/user',userAuth,async(req,res)=>{
    const orders = await order.find({user:req.session.user}).populate({
        path:'items.product',
        model:'product'
    }).sort('-createdDate')
    res.render('user/orders',{orders:orders})
})

//view orders admin (based on filter)
router.get('/:filter',async(req,res)=>{
    const orders = await order.find()
        .populate('user')
        .populate({path:'items.product',model:'product'})
        .sort('-createdDate')
    res.render('admin/orders',{orders:orders,filter:req.params.filter})

})

//view one order for editing (admin)
router.get('/admin/:orderID',async(req,res)=>{
    const orderOB = await order.findById(req.params.orderID)
    .populate('user')
    .populate({path:'items.product',model:'product'})
    res.render('admin/order',{order:orderOB})
})


module.exports = router