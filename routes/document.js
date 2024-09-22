import express from "express";
import passport from "passport";
import Document from "../models/Document.js";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
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
  }
);

router.get(
  "/",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const documents = await Document.find({ owner: req.user._id });
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching documents", error });
    }
  }
);

router.get(
  "/:id",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);

      if (!document || document.owner.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document", error });
    }
  }
);

router.put(
  "/:id",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
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
  }
);

router.delete(
  "/:id",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
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
  }
);

export default router;
