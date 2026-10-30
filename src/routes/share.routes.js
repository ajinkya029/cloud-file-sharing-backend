const router = require("express").Router();
const controller = require("../controllers/share.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:fileId", protect, controller.createShare);
router.get("/", protect, controller.listShares);
router.delete("/:id", protect, controller.revokeShare);
router.get("/:token", controller.downloadShared);

module.exports = router;
