const mongoose = require('mongoose')

const product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    promotion:{
        type:String,
        default:'off'
    },
    oldPrice:{
        type: Number,
        default:0
    },
    size: {
        small:{
            type:String,
            default:'off'
        },
        medium:{
            type:String,
            default:'off'
        },
        large:{
            type:String,
            default:'off'
        }
    },
    active:{
        type:String,
        default:true
    },
    category:{
        type:String,
        default:"pot"
    },
    images:[{
        image:Buffer,
        imageType:String
    }]
})

product.virtual('imagPaths').get(function(){
    if(this.images!=null){
        var paths =[]
        this.images.forEach(element => {
            paths.push(`data: ${element.imageType};charset=utf-8;base64,${element.image.toString('base64')}`)
        });
        return paths
    }
})

module.exports = mongoose.model('product',product)

