// // packages
// let express = require("express");

// // local imports
// let BookModel = require("../models/library");
// let { authenticate, authorize } = require("../middleware/auth.middleware.js");

// let bookRouter = express.Router();

// // Route for adding the books
// bookRouter.post("/addBook", authenticate, authorize(["creator"]), async (req, res) => {
//   try {
//     let { author, title, publishedDate, genre, pages } = req.body;

//     let bookData = new BookModel({
//        author,
//        title,
//        publishedDate,
//        genre,
//        pages,
//        authorID: req.body.user.id,
//        createdAt: new Date()
//        });

//     await bookData.save();
//     res.status(201).send("Book created successfully");

//   } catch (error) {
//     res.status(400).send("Error adding the book");
//   }
// });

// // Route for get the books
// bookRouter.get("/getBooks", authenticate, authorize(["viewer", "viewAll"]), async (req, res) => {
//   try {
//     let { old, new: newBooks } = req.query;
//     let filter = {};

//     if (!req.body.user.role.includes("viewAll")) {
//       filter.authorID = req.body.user.id;
//     }

//     if (old) {
//       filter.createdAt = { $lte: new Date(Date.now() - 10 * 60 * 1000) };
//     } else if (newBooks) {
//       filter.createdAt = { $gt: new Date(Date.now() - 10 * 60 * 1000) };
//     }

//     let books = await BookModel.find(filter);
//     res.status(200).json(books);

//   } catch (error) {
//     res.status(400).send("Error fetching books");
//   }
// });

// // Route for deleting the book
// bookRouter.delete("/deleteBook/:bookID", authenticate, authorize(["creator"]), async (req, res) => {
//   try {
//     let book = await BookModel.findOne({ _id: req.params.bookID, authorID: req.body.user.id });

//     if (!book) return res.status(401).send("Unauthorized");

//     await BookModel.findByIdAndDelete(req.params.bookID);
//     res.status(200).send("Book deleted successfully");
    
//   } catch (error) {
//     res.status(400).send("Error deleting the book");
//   }
// });

// module.exports = bookRouter;


// routes/bookRouter.js
const express = require('express');
const BookModel = require('../models/library');
const { authenticate } = require('../middleware/auth.middleware');

const bookRouter = express.Router();

// Route for adding the books
bookRouter.post('/addBook', authenticate, async (req, res) => {
  try {
    const { author, title, publishedDate, genre, pages } = req.body;

    const bookData = new BookModel({
      author,
      title,
      publishedDate,
      genre,
      pages,
      authorID: req.user.id, // Use req.user populated by middleware
      createdAt: new Date()
    });

    await bookData.save();
    res.status(201).send('Book created successfully');
  } catch (error) {
    res.status(400).send('Error adding the book');
  }
});

// Route for getting the books
bookRouter.get('/getBooks', authenticate, async (req, res) => {
  try {
    const { old, new: newBooks } = req.query;
    const filter = {};

    if (!req.user.role.includes('viewAll')) {
      filter.authorID = req.user.id;
    }

    if (old) {
      filter.createdAt = { $lte: new Date(Date.now() - 10 * 60 * 1000) };
    } else if (newBooks) {
      filter.createdAt = { $gt: new Date(Date.now() - 10 * 60 * 1000) };
    }

    const books = await BookModel.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).send('Error fetching books');
  }
});

// Route for deleting the book
bookRouter.delete('/deleteBook/:bookID', authenticate, async (req, res) => {
  try {
    const book = await BookModel.findOne({ _id: req.params.bookID, authorID: req.user.id });

    if (!book) return res.status(401).send('Unauthorized');

    await BookModel.findByIdAndDelete(req.params.bookID);
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    res.status(400).send('Error deleting the book');
  }
});

module.exports = bookRouter;

