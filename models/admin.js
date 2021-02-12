const mongoose = require('mongoose')
const admin = new mongoose.Schema({
    name:String,
    userName:String,
    password:String
})

module.exports = mongoose.model('Admin',admin)