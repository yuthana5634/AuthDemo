var express                 = require("express");
var mongoose                = require("mongoose");
var passport                = require("passport");
var User                    = require("./models/user");
var bodyParser              = require("body-parser");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    
    secret: "Rusty is the best and cutest dog in the wold",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================================
// ROUTES
//==================================

app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret", function(req,res){
    res.render("secret");
});

// Auth Routes

// show sign up form
app.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
           console.log(err);
            return res.render('register'); 
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// LOGIN ROUTES
// render login form

app.get("/login",function(req,res){
    res.render("login");
});

// login logic
app.post("/login", passport.authenticate("local"), {
    successRedirect: "/secret",
    failureRedirect: "/login"
})

app.listen(3000, "127.0.0.1", function(){
    console.log("server start...");
});