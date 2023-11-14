const jwt = require("jsonwebtoken");
require("dotenv/config");

const authMiddleware = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Esta intentando acceder...")
  console.log(token)
  console.log(secretKey)
  
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed, missing token" });
  }

  if (secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      console.log("Decoded")
      console.log(decoded)
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Authentication failed, invalid token" });
    }
  }

};

module.exports = authMiddleware;
