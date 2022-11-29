require('dotenv').config()
const express = require("express");
var cookieParser = require('cookie-parser')
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
require("./db/conn.js");
const app = express();
const Register = require("./models/registers");
const auth = require("./middleware/auth")
const port = process.env.PORT || 3000;


const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
console.log(template_path)


app.use(express.json()); 
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(cookieParser())
app.set("views",template_path);
app.set("view engine","hbs");
hbs.registerPartials(partials_path);

app.get("/",(req, res) => {
    res.render("index")
});

app.get("/secret",auth,async(req, res) => {
    try {
        res.render("secret");
    } catch (error) {
        res.render("login");
    }
});

app.get("/login",(req, res) => {
    res.render("login");
});

app.get("/logout",auth,async(req, res) => {
    try {
        // for data base
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.token
        });
        
        // for cookies 
        res.clearCookie("jwt");
        await req.user.save();

        res.render("login");
    } catch (error) {
       res.status(500).send(error); 
    }
});

app.get("/logoutall",auth,async(req, res) => {
    try {
        // for data base
        req.user.tokens = [];
        
        // for cookies 
        res.clearCookie("jwt");
        await req.user.save();

        res.render("login");
    } catch (error) {
       res.status(500).send(error); 
    }
});

app.post("/login",async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        const isMatch = bcrypt.compare(password,useremail.password);
        const token = await useremail.generateToken();

        res.cookie("jwt",token
        // ,{
                
        //     httpOnly:true,
        //     expires: new Date(Date.now+90000000),
        // }
        );

       if(isMatch){
        res.status(201).send(`welcome ${useremail.firstname}`);
       }else{
        res.send("invalid password")
       }
    }catch{
        console.log("invalid email");
    }
});

app.get("/register",(req, res) => {
    res.render("register")
});

app.post("/register",async (req, res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password===cpassword){

            const registerEmploye = new Register({

                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })
            console.log(`here scama is created `)

            const token = await registerEmploye.generateToken();
            console.log(`here scama is token is saved `)
            res.cookie("jwt",token
            // ,{
                
            //     httpOnly:true,
            //     expires: new Date(Date.now+90000000),
            // }
            );
            console.log(`here cookies is saved `)

           const registered = await registerEmploye.save();
           res.status(201).render("index");


        }else{{
            res.send("password are not matching")
        }}


    } catch(e){
        res.status(400).send(e);
    }
});





app.listen(port, ()=>{
    console.log(`server is running on port no ${port}`)
})
