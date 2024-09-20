import express from "express";
import Document from "../models/Document.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const newDocument = new Document({
      title,
      content,
      createdBy: req.userId,
    });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: "Error creating document" });
  }
});

router.get("/my-documents", verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ createdBy: req.userId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
});

export default router;
