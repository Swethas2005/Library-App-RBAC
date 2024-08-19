let mongoose = require("mongoose")

// user Schema
let userSchema = mongoose.Schema({
  userName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:[String],
    enum:["creator","viewer","viewAll"],
    default:["viewAll"],
    required:true
  },
  age:{
    type:Number,
    required:true
  },
  bookCreated:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"library",
    required:true
}

});

// user model
const UserModel = mongoose.model("user",userSchema)

// exporting module
module.exports = UserModel