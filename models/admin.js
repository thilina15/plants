const mongoose = require('mongoose')
const admin = new mongoose.Schema({
    userName:String,
    password:String
})

module.exports = mongoose.model('Admin',admin)