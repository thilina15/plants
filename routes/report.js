const express = require('express')
const router = express.Router()

const order = require('../models/order')

//view report
router.get('/',async(req,res)=>{

    var thisMonth = new Date().getMonth()
    var thisYear = new Date().getFullYear()

    var ob = await order.find() 
    var allOrders=[]
    var completedOrders=[]
    var deliveringOrders=[]
    var processingOrders=[]
    var pendingOrders=[]
    var canceledOrders=[]
    ob.forEach(element => {
        const date = new Date(element.createdDate)
        if(thisMonth==date.getMonth() && thisYear==date.getFullYear())
        {
            var ob = {
                createdDate:date.toLocaleDateString()+' '+date.toLocaleTimeString(),
                total:element.total
            }
            switch (element.state) {
                case 'completed':
                    completedOrders.push(ob)
                    break;
                case 'processing':
                    processingOrders.push(ob)
                    break;
                case 'delivering':
                    deliveringOrders.push(ob)
                    break;
                case 'pending':
                    pendingOrders.push(ob)
                    break;
                case 'canceled':
                    canceledOrders.push(ob)
                    break;
                default:
                    break;
            }
            
        }   
    });
    allOrders={
        completed:completedOrders,
        pending:pendingOrders,
        processing:processingOrders,
        delivering:deliveringOrders,
        canceled:canceledOrders
    }
    res.render('report',{orders:allOrders, month:thisMonth, year:thisYear})
})

//view report with month changes
router.post('/',async(req,res)=>{
    var ob = await order.find()
    var allOrders=[]
    var completedOrders=[]
    var deliveringOrders=[]
    var processingOrders=[]
    var pendingOrders=[]
    var canceledOrders=[]
    ob.forEach(element => {
        const date = new Date(element.createdDate)
        if(req.body.month==date.getMonth() && req.body.year==date.getFullYear())
        {
            var ob = {
                createdDate:date.toLocaleDateString()+' '+date.toLocaleTimeString(),
                total:element.total
            }
            switch (element.state) {
                case 'completed':
                    completedOrders.push(ob)
                    break;
                case 'processing':
                    processingOrders.push(ob)
                    break;
                case 'delivering':
                    deliveringOrders.push(ob)
                    break;
                case 'pending':
                    pendingOrders.push(ob)
                    break;
                case 'canceled':
                    canceledOrders.push(ob)
                    break;
                default:
                    break;
            }
            
        }   
    });
    allOrders={
        completed:completedOrders,
        pending:pendingOrders,
        processing:processingOrders,
        delivering:deliveringOrders,
        canceled:canceledOrders
    }
    res.render('report',{orders:allOrders, month:req.body.month, year:req.body.year})
})


module.exports = router