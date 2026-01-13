import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

// Avoid recompiling the model during hot reloads
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
