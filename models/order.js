const mongoose = require('mongoose')

const order = new mongoose.Schema({
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        size:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            default:1
        }
    }],
    total:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    state:{
        type:String,
        default:'processing'
    },
    address:{
        name:String,
        address1st:String,
        address2nd:String,
        mobile:String
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    deliveredDate:Date,
    feedBack:String
})

module.exports = mongoose.model('order',order)