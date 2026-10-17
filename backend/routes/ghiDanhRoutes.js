const express = require("express");
const router = express.Router();
const controller = require("../controllers/ghiDanhController");
const xacThuc = require("../middleware/xacThuc");
const chiAdmin = require("../middleware/chiAdmin");

// Toàn bộ router này đều cần đăng nhập
router.use(xacThuc);

router.get("/cuatoi", controller.khoaHocCuaToi);
router.get("/trangthai/:khoaHocId", controller.trangThaiCuaToi);
router.post("/", controller.ghiDanh);

// Admin: xem danh sách và duyệt thanh toán
router.get("/", chiAdmin, controller.layTatCa);
router.put("/:id/trangthai", chiAdmin, controller.doiTrangThai);

module.exports = router;
