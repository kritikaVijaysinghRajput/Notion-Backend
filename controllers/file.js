import fs from "fs";
import path from "path";
import File from "../models/File.js";

export const uploadFile = async (req, res) => {
  try {
    const { originalname, filename, path: filePath, size } = req.file;

    const file = new File({
      originalName: originalname,
      fileName: filename,
      filePath,
      size,
      uploadedAt: Date.now(),
    });

    await file.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: "Error downloading file", error });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    fs.unlinkSync(file.filePath);
    await file.remove();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
};
