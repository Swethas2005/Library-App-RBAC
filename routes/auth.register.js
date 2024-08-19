//packages
let express = require("express")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")

// local imports 
let UserModel = require("../models/user.js")
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
let JWT_SECRET_KEY_2 = process.env.JWT_SECRET_KEY_2
let blacklistedToken = require("../models/blacklisted.js")

// parent router for registration and login
let authRouter = express.Router();

// Access token
function generateAccessToken(user) {
    return jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "15m" }); 
}

// Refresh  token
function generateRefreshToken(user) {
    return jwt.sign(user, JWT_SECRET_KEY_2, { expiresIn: "12h" }); 
}

// auth for registering the user
authRouter.post("/register",async (req,res)=>{
    let {userName,email,password,role,age} = req.body

    let user = await UserModel.find({userName});

    if(user.length>0)
         res.status(307).json({message:"User already exist with the userName please login"})
    

    // hashing the password
    bcrypt.hash(password,5, async function(err, hash) {
        try {
            if(err) return res.status(400).send({message:"Something went wrong while hashing the password"})

            let newUser = new UserModel({
                userName,
                email,
                password:hash,
                role,
                age
            });
            await newUser.save()
            res.status(201).send("user registered successfully")
        } catch (error) {
            res.status(400).send(error)
        }
    });
})

// user login 
authRouter.post("/login", async (req, res) => {
    try {
        let { password, email } = req.body;
        
        let user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).send("User not found");
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (result) {
                const accessToken = generateAccessToken({ role: user.role, userName: user.userName });
                const refreshToken = generateRefreshToken({ role: user.role, userName: user.userName });

                user.refreshToken = refreshToken;
                await user.save();

                res.json({message:"user login successfully"})
                res.json({ accessToken, refreshToken });
            } else {
                res.status(400).send("Wrong Credentials");
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Route to Refresh the Access Token
authRouter.post("/token", async (req, res) => {
    try {
        const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).send("Refresh Token is required");
    }

    jwt.verify(refreshToken, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid Refresh Token");
        }

        const newAccessToken = generateAccessToken({ role: user.role, userName: user.userName });

        res.json({ accessToken: newAccessToken });
    });
    } catch (error) {
        console.log(error);
        res.status(401).send({message:"Internal server error"})
    }
});

// logout route
authRouter.post("/logout",async (req,res)=>{
    try {
        let authHeader = req.headers.authorization

        if(!authHeader){
            return res.status(401).send("Authorization missing the headers")
        }

        let token = authHeader.token.split(" ")[1]

        if(!token){
            return res.status(401).send("Token not found")
        }

        let blacklistedToken = new blacklistedToken.find();

        await blacklistedToken.save()
        res.status.send({message:"user logged out successfully "});
    } catch (error) {
        console.log(error);
        res.status(401).send({message:"Internal server error"})
    }
})



module.exports = authRouter

