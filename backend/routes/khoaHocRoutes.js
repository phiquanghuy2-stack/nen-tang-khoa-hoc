const express = require("express");
const router = express.Router();
const controller = require("../controllers/khoaHocController");
const { routerLong } = require("./baiHocRoutes");
const xacThuc = require("../middleware/xacThuc"); // THÊM
const chiAdmin = require("../middleware/chiAdmin"); // THÊM
const xacThucTuyChon = require("../middleware/xacThucTuyChon");

// Ai cũng xem được (admin thì thấy thêm bản nháp)
router.get("/", xacThucTuyChon, controller.layTatCa);
router.get("/:id", xacThucTuyChon, controller.layTheoId);

// Chỉ admin
router.post("/", xacThuc, chiAdmin, controller.them); // SỬA
router.put("/:id", xacThuc, chiAdmin, controller.sua); // SỬA
router.delete("/:id", xacThuc, chiAdmin, controller.xoa); // SỬA

router.use("/:khoaHocId/baihoc", routerLong);

module.exports = router;
