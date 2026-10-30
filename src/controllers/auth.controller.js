const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/token");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    token: signToken(user.id)
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+password");
  const valid = user && await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token: signToken(user.id)
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});
