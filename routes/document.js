import express from "express";
import Document from "../models/Document.js";

const router = express.Router();

// Middleware to simulate user authentication (for example purposes)
const authenticateUser = (req, res, next) => {
  // Assuming you have a way to extract user info from headers or session
  const userId = req.headers["user-id"]; // Example: getting user ID from request headers
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = { _id: userId }; // Simulate user object
  next();
};

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({
      title,
      content,
      owner: req.user._id,
    });
    await document.save();
    res.status(201).json({ message: "Document created", document });
  } catch (error) {
    res.status(500).json({ message: "Error creating document", error });
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user._id });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document", error });
  }
});

router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    let document = await Document.findById(req.params.id);

    if (!document || document.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.title = title || document.title;
    document.content = content || document.content;
    await document.save();

    res.status(200).json({ message: "Document updated", document });
  } catch (error) {
    res.status(500).json({ message: "Error updating document", error });
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.remove();
    res.status(200).json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting document", error });
  }
});

export default router;
