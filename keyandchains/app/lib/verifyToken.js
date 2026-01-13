import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (e) {
    console.error("JWT Verify Error:", e.message);
    return null;
  }
};

export default verifyToken;
