




//user auth
exports.userAuth =function (req,res,next){
    if(req.session.user!=null){
        const userOB = req.session.user
        res.locals.user=userOB
        next()    
    }else{
        res.redirect('/user/login')
    }
}