const crypto = require("crypto");
const fs = require("fs");
const File = require("../models/File");
const Share = require("../models/Share");
const asyncHandler = require("../utils/asyncHandler");

exports.createShare = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.fileId, owner: req.user.id });
  if (!file) return res.status(404).json({ message: "File not found" });

  let expiresAt = null;
  if (req.body.expiresInHours !== undefined && req.body.expiresInHours !== "") {
    const hours = Number(req.body.expiresInHours);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24 * 30) {
      return res.status(400).json({ message: "expiresInHours must be between 1 and 720" });
    }
    expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  const share = await Share.create({
    token: crypto.randomBytes(32).toString("hex"),
    file: file.id,
    owner: req.user.id,
    expiresAt
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.status(201).json({
    share: { id: share.id, token: share.token, expiresAt: share.expiresAt },
    url: `${baseUrl}/api/shares/${share.token}`
  });
});

exports.listShares = asyncHandler(async (req, res) => {
  const shares = await Share.find({ owner: req.user.id, revokedAt: null })
    .populate("file", "originalName size mimeType")
    .sort({ createdAt: -1 });
  res.json({ shares });
});

exports.revokeShare = asyncHandler(async (req, res) => {
  const share = await Share.findOne({ _id: req.params.id, owner: req.user.id });
  if (!share) return res.status(404).json({ message: "Share link not found" });
  share.revokedAt = new Date();
  await share.save();
  res.json({ message: "Share link revoked" });
});

exports.downloadShared = asyncHandler(async (req, res) => {
  const share = await Share.findOne({ token: req.params.token, revokedAt: null }).populate("file");
  if (!share || (share.expiresAt && share.expiresAt <= new Date())) {
    return res.status(404).json({ message: "Share link is invalid or expired" });
  }
  const file = share.file;
  if (!file || !fs.existsSync(file.storagePath)) return res.status(404).json({ message: "Shared file not found" });
  share.downloadCount += 1;
  await share.save();
  res.download(file.storagePath, file.originalName);
});
