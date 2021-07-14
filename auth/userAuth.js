




//user auth
exports.userAuth =function (req,res,next){
    if(req.session.user!=null){
        next()    
    }else{
        res.redirect('/user/login')
    }
}