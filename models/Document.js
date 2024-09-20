import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
