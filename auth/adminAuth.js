


//admin auth
exports.adminAuth=function(req,res,next){
    if(req.session.admin!=='plantasyAdmin'){
        res.redirect('/admin/login')
    }else{
        res.locals.admin=true
        next()
    }
}