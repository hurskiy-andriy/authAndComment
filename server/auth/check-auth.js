var cookieParser = require('cookie-parser');

exports.check = 
    function(req, res, next) {
        if( !req.cookies || 
            !req.cookies["usr-mail"] ||
            !req.cookies["usr-name"] ||
            !req.cookies["usr-token"])
                res.redirect("/auth/google");
        else
                next();
    };