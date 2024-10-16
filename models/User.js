import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
