const ex = require('express')
const router = ex.Router()
const {userAuth} = require('../auth/userAuth')
const user = require('../models/user')
const cart = require('../models/cart')
const product = require('../models/product')


router.post('/add/:id',userAuth,async(req,res)=>{
    var breakExc ={} //fake exception throw
    try{
        var userOBJ = await user.findOne({_id:req.session.user._id})
        var cartOBJ = await cart.findById(userOBJ.cart)
        var productOBJ = await product.findOne({_id:req.params.id})

        //check product already in cart
        
        cartOBJ.items.forEach(item => {
            if(item.product==productOBJ.id && item.size==req.body.size){
                item.quantity= item.quantity + req.body.quantity
                throw breakExc //get out from loop
            }
        })
        //push new item
        cartOBJ.items.push({
            product:productOBJ,
            size:req.body.size,
            quantity:req.body.quantity  
        })
    }catch(e){
        if(e!==breakExc){
            throw e
        }
    }
    await cartOBJ.save()
    res.send(cartOBJ)
  
})



module.exports = router