import express from "express";
import multer from "multer";
import {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile,
} from "../controllers/file.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getAllFiles);
router.get("/:id/download", downloadFile);
router.delete("/:id", deleteFile);

export default router;
