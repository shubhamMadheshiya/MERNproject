const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/usersdb'
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   }
).then(()=>{
    console.log(`connection sucessful`)
}).catch((e)=>{
    console.log(e)
})