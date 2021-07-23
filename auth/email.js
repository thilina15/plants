if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'../.env'})   
}

const nodeMailer = require('nodemailer')

//config email
exports.transpoter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    }
})

