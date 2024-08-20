// packages
let express = require("express");
let dotenv = require("dotenv").config();
let cors = require("cors");
let morgan = require("morgan");

// local imports
let connection = require("./config/db.js");
let authRouter = require("./routes/auth.register.js");
let bookRouter = require("./routes/book.route.js");

let app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use("/auth", authRouter);
app.use("/books", bookRouter);

app.get("/", (req, res) => {
  res.send("Library App Server is Running");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error)
  }
})