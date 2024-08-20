let mongoose = require("mongoose");

// bookSchema
let bookSchema = mongoose.Schema({
  author: 
  { type: String,
    required: true 
  },

  title:
  { type: String, 
    required: true 
  },

  publishedDate:
  { type: Number,
    required: true
  },

  genre: 
  { type: String, 
    required: true 
  },

  pages: 
  { type: Number, 
    required: true 
  },

  authorID: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },

  createdAt: 
  { type: Date, 
    default: Date.now 
  },

  updatedAt: 
  { type: Date, 
    default: Date.now 
  }
});

// BookModel
const BookModel = mongoose.model("library", bookSchema);

// exporting the module
module.exports = BookModel;
