let express = require("express")

let BookModel = require("../models/library")
let { authenticate, authorize } = require("../middleware/auth.middleware.js");

let bookRouter = express.Router();

// add the book
bookRouter.post("/addBook", authenticate, authorize(["creator"]), async (req, res) => {
    try {
     let {author,title,publishedDate,genre,pages} = req.body;
 
     let bookData = new BookModel({
         author,
         title,
         publishedDate,
         genre,
         pages,
         authorID: req.body.user._id 
     });
     await bookData.save();
     res.status(201).send("Book created successfully");
 
    } catch (error) {
     res.status(400).send("something went wrong while adding the data");
    }
 });
 
//  get  all the books
 bookRouter.get("/getBook", authenticate (["viewer"]), async (req, res) => {
     try {
         let bookData;
         if (req.body.user.role.includes("viewAll")) {
             bookData = await BookModel.find();
         } else {
             bookData = await BookModel.find({ authorID: req.body.user._id });
         }
 
         res.status(200).json({
             message: "Data received successfully",
             data: bookData
         });
     } catch (error) {
         res.status(400).send("something went wrong while getting the data");
     }
 });
 
//  delete the book
 bookRouter.delete("/delete-book/:bookID", authenticate, authorize(["creator"]), async (req, res) => {
     try {
         let id = req.params.bookID;
 
         
         let book = await BookModel.findOne({ _id: id, authorID: req.body.user._id });
         if (!book) {
             return res.status(401).send("You don't have permission to delete this book.");
         }
 
         await BookModel.findByIdAndDelete(id);
         res.status(201).send("Book deleted successfully");
 
     } catch (error) {
         res.status(400).send("something went wrong while deleting the data");
     }
 });
 

module.exports = bookRouter

