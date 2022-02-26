const express = require("express");
const router = express.Router();
const users = require('../model/user');
var bcrypt = require("bcryptjs");
const passport = require("passport");
require('./passportLocal')(passport);
require('./googleAuth')(passport);
const userRoutes = require('./accountRoutes');
const api_router = require('./api_routes');


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.redirect('/login');
    }
}

router.use('/apis', api_router);

router.get("/",(req,res)=>{
    if (req.isAuthenticated()) {
        res.render("index", { logged: true });
    } else {
        res.render("index", { logged: false });
    }
});

router.get("/signup",(req,res)=>{
    res.render("signup",{ csrfToken : req.csrfToken() });
});

router.get("/login",(req,res)=>{
    res.render("login", { csrfToken : req.csrfToken() });
});

router.post("/signup",async(req,res)=>{
    const { email, username , password , confirmpassword} = req.body;

    if(!email || !username || !password || !confirmpassword){
        res.render('signup',{  csrfToken : req.csrfToken(), err: "All fields Required" });
    }else if(password != confirmpassword){
        res.render('signup',{  csrfToken : req.csrfToken(), err: "All fields Required",
    });
    }else {
        //login
        //only one email is used 
      var userData = await users.findOne({$or: [ { email:email },{ username: username }],

    });
    if(userData){
        res.render('signup',
        {  csrfToken : req.csrfToken(), 
            err: "User Exists, try logining In !", });
    }else {
        
        var salt = await bcrypt.genSalt(12);
        var hash = await bcrypt.hash(password,salt);

        await users({
            email: email,
            username: username,
            password: hash
        }).save();

        res.redirect("/login");
    }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile',
        failureFlash: true,
    })(req, res, next);
});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.session.destroy((err)=>{
        res.redirect('/');
    })
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});

router.get('/profile', checkAuth, (req, res) => {
    // adding a new parameter for checking verification
    res.render('profile', { username: req.user.username, verified : req.user.isVerified });
});


router.use(userRoutes);

//board routes
router.use("/board",require("./ideaRoutes"));

module.exports = router;