const express = require("express");
const mongo = require('./config/db');
const router = require("./controller/routes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
var MemoryStore = require('memorystore')(expressSession)
const csrf = require('csurf');
const passport = require("passport");
const flash = require("connect-flash");

const app = express();

//connect to db
mongoose.connect('mongodb://localhost:27017/Board',{useNewUrlParser: true,useUnifiedTopology: true},(err) => console.log('Successfully Connected'));


app.use(express.urlencoded({extended:true}));
app.use("/static",express.static(__dirname + "/static"));

app.set("view engine","ejs");
app.set("views",__dirname + "/views");
app.use(cookieParser('randomKey'));
app.use(expressSession({
    secret: "randomKey",
    resave: true,
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}))

app.use(csrf())

app.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
  });

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.error = req.flash("error");
  next();
})

app.use(require('./controller/routes.js'));

const PORT = process.env.PORT || 8000;
app.listen(PORT , () => console.log("Started Server at PORT 3000"));