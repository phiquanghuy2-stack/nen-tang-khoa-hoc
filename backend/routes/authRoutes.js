const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const xacThuc = require("../middleware/xacThuc");

router.post("/dangky", controller.dangKy);
router.post("/dangnhap", controller.dangNhap);
router.get("/toi", xacThuc, controller.toiLaAi);

module.exports = router;
