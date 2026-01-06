const jwt = require("jsonwebtoken");
const path = require("path");

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET 

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (e) {
    console.error("JWT Verify Error:", e.message);
    return null;
  }
};

module.exports = verifyToken;