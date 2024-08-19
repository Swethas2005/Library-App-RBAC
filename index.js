// packages
let express = require("express")
let dotenv = require("dotenv").config()

// local imports 
let PORT = process.env.PORT
let connection = require("./config/db.js")
let authRouter = require("./routes/auth.register.js")
let bookRouter = require("./routes/book.route.js")

let app = express();

app.use(express.json())
app.use("/auth",authRouter)
app.use("/book",bookRouter)

app.get("/",(req,res)=>{
    res.send("Server is running fine")
})

app.listen(PORT,async()=>{
    try {
        await connection
        console.log(`Server is running on the ${PORT} and connected to the DB`)
    } catch (error) {
        console.log(error);
    }
})