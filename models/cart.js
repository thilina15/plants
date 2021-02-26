const mongoose = require('mongoose')

const cart = new mongoose.Schema({
    
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
    }]
})

cart.virtual('total').get(function(){
    if(this.items!=null){
        var total =0;
        this.items.forEach(item => {
            total = total+(item.product.price * item.quantity)
        });
        return total    
    }
})

module.exports = mongoose.model('cart',cart)