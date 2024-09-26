import File from "../models/File.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Create a record in your database (if needed)
  const newFile = new File({
    filename: req.file.filename,
    path: req.file.path,
  });

  newFile
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "File uploaded successfully", file: newFile });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error saving file", error: err });
    });
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
    // Fetch the file from the database using the ID from the request params
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Construct the full path to the file
    const filePath = path.join(__dirname, "..", file.path); // Adjust as needed

    // Check if file exists before downloading
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Proceed to download the file
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).json({ message: "Error downloading file", error: err });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching file", error });
  }
};

export const deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", file.path);

    console.log("Constructed file path:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, async (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error deleting file", error: err });
        }

        await File.findByIdAndDelete(fileId);

        res.status(200).json({ message: "File deleted successfully" });
      });
    } else {
      console.log("File does not exist:", filePath);
      return res.status(404).json({ message: "File does not exist" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file", error });
  }
};
