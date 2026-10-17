const express = require("express");
const router = express.Router();
const xacThuc = require("../middleware/xacThuc");
const chiAdmin = require("../middleware/chiAdmin");
const { taiAnh } = require("../middleware/taiAnh");

// Gửi multipart/form-data với field tên "anh"
router.post("/", xacThuc, chiAdmin, (req, res) => {
  // Gọi multer thủ công để tự trả lỗi 400 thay vì để Express trả 500
  taiAnh.single("anh")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Ảnh tối đa 2MB" : err.message;
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn ảnh" });
    }

    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;
