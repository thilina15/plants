const express = require('express')
const router = express.Router()
const user = require('../models/user')
const cart = require('../models/cart')
const {userAuth} = require('../auth/userAuth') 
const {adminAuth} = require('../auth/adminAuth')
const order = require('../models/order')
const { findById } = require('../models/user')
const { route } = require('./home')


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
router.get('/:filter',adminAuth,async(req,res)=>{
    const orders = await order.find()
        .populate('user')
        .populate({path:'items.product',model:'product'})
        .sort('-createdDate')
    res.render('admin/orders',{orders:orders,filter:req.params.filter})
})

//view one order for editing (admin)
router.get('/admin/:orderID',adminAuth,async(req,res)=>{
    const orderOB = await order.findById(req.params.orderID)
    .populate('user')
    .populate({path:'items.product',model:'product'})
    res.render('admin/order',{order:orderOB})
})

router.post('/admin/:orderID',async(req,res)=>{
    var orderOB = await order.findById(req.params.orderID)
    orderOB.state=req.body.state
    if(req.body.state=='completed'){
        orderOB.deliveredDate = Date.now()
    }
    await orderOB.save()
    res.redirect('/order/'+req.body.state)
})

//view one order for user
router.get('/user/:orderID',userAuth,async(req,res)=>{
    var orderOB = await order.findById(req.params.orderID)
    .populate({path:'items.product',model:'product'})
    var progress=''
    var statement=''
    switch (orderOB.state) {
        case 'pending':
            progress = '25'
            statement='We will check your order soon..'
            break;
        case 'processing':
            progress = '50'
            statement='Your order is getting ready..'
            break;
        case 'delivering':
            progress = '75'
            statement='Your order is on the way..'
            break;
        case 'completed':
            progress = '100'
            statement='Your order is completed..'
            break;
        case 'canceled':
            progress = '0'
            statement='Your order is canceled..'
            break;
        default:
            break;
    }
    res.render('user/order',{order:orderOB,progress:progress,statement:statement})
})

//add feedback
router.post('/feedback/:orderID',async(req,res)=>{
    var orderOB = await order.findById(req.params.orderID)
    console.log(req.body)
    orderOB.feedBack = req.body.feedBack
    orderOB.rating = req.body.rate
    orderOB.feedBackDone = true
    await orderOB.save()

    res.redirect('/order/user/'+req.params.orderID)
})

module.exports = router