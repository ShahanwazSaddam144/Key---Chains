const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); 
const cookieParser = require('cookie-parser');
const User = require("./controllers/users");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===================
// CORS 
// ===================
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,               
}));

// ===================
// Middlewares
// ===================
app.use(express.json());
app.use(cookieParser());
// ===================
// Logging
// ===================
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// ===================
// Rate limiting
// ===================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests. Please try again later.',
});
app.use(limiter);

// ===================
// Routes
// ===================
app.use('/', User); 


// ===================
// MongoDB Connection
// ===================
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
