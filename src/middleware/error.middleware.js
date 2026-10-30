exports.notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

exports.errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File exceeds the configured size limit" });
  }
  res.status(err.statusCode || 500).json({
    message: err.statusCode ? err.message : "Internal server error"
  });
};
