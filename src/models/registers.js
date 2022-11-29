const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");

const employeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },

    tokens:[{
            token:{
                type:String,
                required:true 
            }
        } ]


});

employeSchema.methods.generateToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

employeSchema.pre("save",async function(next){
 
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword =  await bcrypt.hash(this.password, 10);;

    }
    next();
    
})


const Register = new mongoose.model ("Register",employeSchema);


module.exports = Register; 