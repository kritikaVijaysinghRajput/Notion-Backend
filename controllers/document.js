import Document from "../models/Document.js";

export const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDocument = new Document({ title, content, user: req.user._id });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: "Error creating document" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: "Error fetching document" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Document not found" });
    }

    document.title = title || document.title;
    document.content = content || document.content;
    await document.save();

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: "Error updating document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await document.remove();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting document" });
  }
};
