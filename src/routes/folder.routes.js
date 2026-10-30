const router = require("express").Router();
const controller = require("../controllers/folder.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.post("/", controller.createFolder);
router.get("/", controller.listFolders);
router.delete("/:id", controller.deleteFolder);

module.exports = router;
