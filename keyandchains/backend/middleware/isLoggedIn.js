const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect("/");
  } catch (err) {
    next();
  }
};

module.exports = isLoggedIn;
