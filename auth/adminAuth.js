


//admin auth
exports.adminAuth=function(req,res,next){
    if(req.session.userType!=='plantasyAdmin'){
        res.redirect('/admin/login')
    }else{
        res.locals.admin=true
        next()
    }
}