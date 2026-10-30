const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const Folder = require("../models/Folder");
const Share = require("../models/Share");
const asyncHandler = require("../utils/asyncHandler");

exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Choose a file to upload" });

  const folderId = req.body.folderId || null;
  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, owner: req.user.id });
    if (!folder) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Folder not found" });
    }
  }

  const file = await File.create({
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype || "application/octet-stream",
    size: req.file.size,
    storagePath: req.file.path,
    owner: req.user.id,
    folder: folderId
  });
  res.status(201).json({ file });
});

exports.listFiles = asyncHandler(async (req, res) => {
  const filter = { owner: req.user.id };
  if (req.query.folderId === "root" || req.query.folderId === "null") filter.folder = null;
  else if (req.query.folderId) filter.folder = req.query.folderId;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const [files, total] = await Promise.all([
    File.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    File.countDocuments(filter)
  ]);
  res.json({ files, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.getFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user.id });
  if (!file) return res.status(404).json({ message: "File not found" });
  res.json({ file });
});

exports.downloadFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user.id });
  if (!file || !fs.existsSync(file.storagePath)) return res.status(404).json({ message: "File not found" });
  res.download(file.storagePath, file.originalName);
});

exports.deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user.id });
  if (!file) return res.status(404).json({ message: "File not found" });

  await Share.updateMany({ file: file.id, owner: req.user.id, revokedAt: null }, { revokedAt: new Date() });
  await file.deleteOne();
  fs.unlink(file.storagePath, () => {});
  res.json({ message: "File deleted" });
});

exports.renameFile = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "New file name is required" });
  const file = await File.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { originalName: name },
    { new: true, runValidators: true }
  );
  if (!file) return res.status(404).json({ message: "File not found" });
  res.json({ file });
});
