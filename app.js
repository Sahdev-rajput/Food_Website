require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const session=require("express-session");
const findOrCreate = require('mongoose-findorcreate');
//const encrypt=require("mongoose-encryption");
//const md5=require("md5");
//const bcrypt=require("bcrypt");
//const saltRounds=10;


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:"My name is Sahdev Rajput.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//var encKey = process.env.ENCKEY;
//var sigKey = process.env.SIGKEY;

mongoose.connect("mongodb://127.0.0.1:27017/feedbacksDB");
const feedbackSchema=new mongoose.Schema({
    FullName: String,
    Email: String,
    password: String,
    comment:String
})
feedbackSchema.plugin(passportLocalMongoose);
feedbackSchema.plugin(findOrCreate);
const Feedback=mongoose.model("User",feedbackSchema);
passport.use(Feedback.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Feedback.findById(id, function(err, user) {
      done(err, user);
    });
  });
//const mySecret="This is one of my favourite secret";
//feedbackSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['Password'] });
app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/login",function(req,res)
{
    res.render("login");
})
app.get("/register",function(req,res)
{
    res.render("register");
})
app.get("/feedback",function(req,res)
{
    /*Feedback.find({comment:{$ne:null}}).then(results=>{
        if(results)
        {
            res.render("feedback",{userFeedback:results});
        }
    })*/
});
app.get("/write",function(req,res)
{
    //console.log(req.user);
    res.render("write");
});


app.post("/register",function(req,res)
{
   /* bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(err)
        {
            console.log(err);
        }
        else
        {
        const newUser=new Feedback({
            FullName: req.body.name,
            Email: req.body.email,
            Password: hash,
            })
            newUser.save();
            res.redirect("/");
        }
    });*/
    Feedback.register({username: req.body.email,name:req.body.name},req.body.password,function(err,user)
    {
       res.redirect("/login");
    })
});
app.post("/login",function(req,res)
{
    const usera=new Feedback({
        username: req.body.address,
        password: req.body.pass
    });
    req.login(usera, function(err) {
       if(err)
       {
          console.log(err);
         // res.redirect("/login");
       }
       else{
       // console.log(req);
       passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
})
});
app.post("/write",function(req,res)
{
   // console.log(req.user);
   //const data=req.body.feedback;
    //res.render("feedback",{content:data});
})








app.listen(3000, function() {
    console.log("Server started on port 3000.")
});

/*Feedback.findOne({Email:req.body.address}).then(results=>{
        bcrypt.compare(req.body.pass, results.Password, function(err, result) {
            // result == true
            if(result==true)
            {
                res.render("write");
            }
            else
            {
                res.redirect("/login");
            }
        });
      })*/
    /*bcrypt.compare(req.body.pass, hash, function(err, result) {
        if(result==true)
        {
           
        }*/
    //});