let mongoose = require("mongoose");

// userSchema
let userSchema = mongoose.Schema({
  userName:
   { type: String,
     required: true
   },

  email: 
  { type: String,
    required: true
  },

  password:
  { type: String,
    required: true 
  },

  role: {
    type: [String],
    enum: ["creator", "viewer", "viewAll"],
    default: ["viewAll"],
    required: true,
  },

  age:
   { type: Number, 
    required: true
   },

  bookCreated:
   [{ type: mongoose.Schema.Types.ObjectId,
     ref: "library"
     }],
});

// userModel
const UserModel = mongoose.model("user", userSchema);

// exporting the module
module.exports = UserModel;
