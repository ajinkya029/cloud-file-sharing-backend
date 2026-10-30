const Folder = require("../models/Folder");
const File = require("../models/File");
const asyncHandler = require("../utils/asyncHandler");

exports.createFolder = asyncHandler(async (req, res) => {
  const { name, parentId = null } = req.body;
  if (!name || !String(name).trim()) return res.status(400).json({ message: "Folder name is required" });

  if (parentId) {
    const parent = await Folder.findOne({ _id: parentId, owner: req.user.id });
    if (!parent) return res.status(404).json({ message: "Parent folder not found" });
  }

  const folder = await Folder.create({ name: String(name).trim(), parent: parentId, owner: req.user.id });
  res.status(201).json({ folder });
});

exports.listFolders = asyncHandler(async (req, res) => {
  const parent = req.query.parentId || null;
  const folders = await Folder.find({ owner: req.user.id, parent }).sort({ name: 1 });
  res.json({ folders });
});

exports.deleteFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  const childFolders = await Folder.countDocuments({ owner: req.user.id, parent: folder.id });
  const files = await File.countDocuments({ owner: req.user.id, folder: folder.id });
  if (childFolders || files) {
    return res.status(409).json({ message: "Folder must be empty before it can be deleted" });
  }
  await folder.deleteOne();
  res.json({ message: "Folder deleted" });
});
