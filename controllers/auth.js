import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create and save the new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during signup.", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if passwords match
    const isMatch = await user.matchPassword(password); // Use the method from your user model
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Store user ID in session or send a token as needed
    req.session.userId = user._id; // Assuming session management is in place

    res.status(200).json({ message: "Signin successful.", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during signin.", error });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // clear the session cookie
    res.json({ message: "Logout successful" });
  });
};
