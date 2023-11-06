const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => {
  try {
    //get authorization header
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const err = new Error("Authentication header is not provided.");
      err.statusCode = 401;
      throw err;
    }
    const token = authHeader.split(" ")[1];

    let decodedToken = jwt.verify(token, JWT_SECRET_KEY);

    if (!decodedToken) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
};
