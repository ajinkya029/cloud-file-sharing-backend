const router = require("express").Router();
const controller = require("../controllers/file.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(protect);
router.post("/upload", upload.single("file"), controller.uploadFile);
router.get("/", controller.listFiles);
router.get("/:id/download", controller.downloadFile);
router.get("/:id", controller.getFile);
router.patch("/:id", controller.renameFile);
router.delete("/:id", controller.deleteFile);

module.exports = router;
