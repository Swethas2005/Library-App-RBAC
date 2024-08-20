// packages
let express = require("express");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

// local imports
let UserModel = require("../models/user");
let authRouter = express.Router();

// Route for registration
authRouter.post("/register", async (req, res) => {
  let { userName, email, password, role, age } = req.body;

  let userExists = await UserModel.findOne({ email });

  if (userExists) return res.status(409).send("User already exists");

  bcrypt.hash(password, 5, async (err, hash) => {
  
    if (err) return res.status(500).send("Server Error");

    let newUser = new UserModel({ 
      userName,
      email,
      password: hash,
      role,
      age 
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  });
});


// Route for login
authRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await UserModel.findOne({ email });

  if (!user) return res.status(400).send("User not found ");

  bcrypt.compare(password, user.password, (err, result) => {

    if (err || !result) return res.status(400).send("Invalid Credentials");

    let accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    let refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY_2, { expiresIn: "12h" });

    res.json({ accessToken, refreshToken });
  });
});

// Route for getting toke
authRouter.post("/token", (req, res) => {
  let { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).send("Refresh Token required");

  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY_2, (err, user) => {

    if (err) return res.status(403).send("Invalid Refresh Token");

    let newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

    res.json({ accessToken: newAccessToken });
  });
});


authRouter.post("/logout", (req, res) => {
  // Implement token blacklisting if necessary
  res.status(200).send("Logged out successfully");
});

module.exports = authRouter;
