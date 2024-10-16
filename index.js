import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/file.js";
import documentRoutes from "./routes/document.js";
import { requireAuth, verifyClerkToken } from "./middlewares/clerkAuth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(verifyClerkToken);

app.use("/uploads", express.static("uploads"));

app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.post("/api/users", async (req, res) => {
  const { clerkId, email, name } = req.body;
  const newUser = new User({ clerkId, email, name });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.json({
    message: `Welcome to the Organization Dashboard, User ID: ${req.session.userId}`,
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Connection Error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
