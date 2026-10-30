const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }
}, { timestamps: true });

folderSchema.index({ owner: 1, parent: 1, name: 1 });

module.exports = mongoose.model("Folder", folderSchema);
