var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
    passports = require("./server/auth/passports"),
    auth = require("./server/auth/check-auth"),
    comments = require("./server/comments/comments"),
    cookieParser = require('cookie-parser'),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    express = require("express"),
    app = express();

(function(){

    var port = process.env.NODEPORT || 9009,
        cookieAge = 604800000;  //7 days

    passport.serializeUser(function(user, done) {done(null, user.id);});
    passport.deserializeUser(function(id, done) {done(null, id);});

    passport.use(
            new GoogleStrategy(
                    passports.googlePassport,
                    function(token, refreshToken, profile, done) {
                        return done(null, profile, token, refreshToken);
                    }));

    app
        .use(cookieParser())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({extended: true}))
        .use(passport.initialize())
        .use(
            function(req, res, next) {
                console.log(req.url, req.method, req.body, req.query); 
                next();
            })
        .use(
            "/auth/google", 
            passport.authenticate("google",  {scope: ["profile", "email"]}))
        .use(
            "/auth/google/callback", 
            function(req, res) {

                res.cookie(
                    "usr-token",
                    req.authInfo,
                    {maxAge: cookieAge});

                res.cookie(
                    "usr-name",
                    req.user.displayName,
                    {maxAge: cookieAge});

                var email = "";
                if( req.user.emails && 
                    req.user.emails.length > 0 &&
                    req.user.emails[0].value)
                        email = req.user.emails[0].value;

                res.cookie(
                    "usr-mail",
                    email,
                    {maxAge: cookieAge});

                res.redirect("/");
            })
        .post("/get-comments", auth.check, comments.get)
        .post("/add-comment", auth.check, comments.add)
        .use("/client", express.static(__dirname+"/client"))
        .use("/node_modules", express.static(__dirname+"/node_modules"))
        .use("/", express.static(__dirname+"/client", {index: "/index.html"}))
        .listen(process.env.NODEPORT || 9009);

    console.log("<"+(new Date())+"> server has been started. port: "+port);
})();

