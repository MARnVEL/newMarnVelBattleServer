
const isAdmin = ( req, res, next ) => {
    
    if( req.user.is_admin === false ){
        return res.status(401).json({
            message: 'You must be an Admin user!'
        });
    };
    
    next();
}

module.exports = isAdmin;

