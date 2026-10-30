const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true, unique: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }
}, { timestamps: true });

fileSchema.index({ owner: 1, folder: 1, createdAt: -1 });

module.exports = mongoose.model("File", fileSchema);
