const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, default: null },
  revokedAt: { type: Date, default: null },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Share", shareSchema);
