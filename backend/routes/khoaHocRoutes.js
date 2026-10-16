const express = require("express");
const router = express.Router();
const controller = require("../controllers/khoaHocController");
const { routerLong } = require("./baiHocRoutes"); // THÊM

router.get("/", controller.layTatCa);
router.get("/:id", controller.layTheoId);
router.post("/", controller.them);
router.put("/:id", controller.sua);
router.delete("/:id", controller.xoa);

router.use("/:khoaHocId/baihoc", routerLong); // THÊM

module.exports = router;
