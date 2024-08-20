// packages
let jwt = require("jsonwebtoken");

// local imports
let UserModel = require("../models/user");

// authentication
// function authenticate(req, res, next) {
//   let token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).send("Token not found");

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    
//     if (err) return res.status(403).send("Invalid Token");

//     req.body.user = user;
//     next();
//   });
// }

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token

  if (!token) return res.status(401).send('Token not found');

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user; // Save user info in request object
    next();
  });
};

// authorization
function authorize(roles) {
  return (req, res, next) => {
    if (roles.some(role => req.body.user.role.includes(role))) {
      next();
    } else {
      res.status(403).send("You don't have permission to use this route");
    }
  };
}

module.exports = { authenticate, authorize };

