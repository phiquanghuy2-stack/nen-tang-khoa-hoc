const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const THU_MUC = path.join(__dirname, "..", "uploads");
fs.mkdirSync(THU_MUC, { recursive: true });

const DUOI_HOP_LE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const taiAnh = multer({
  storage: multer.diskStorage({
    destination: THU_MUC,
    // Tên file ngẫu nhiên — không tin tên do người dùng gửi lên
    filename: (req, file, cb) => {
      const ten = Date.now() + "-" + crypto.randomBytes(6).toString("hex");
      cb(null, ten + DUOI_HOP_LE[file.mimetype]);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (DUOI_HOP_LE[file.mimetype]) return cb(null, true);
    cb(new Error("Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF"));
  },
});

module.exports = { taiAnh, THU_MUC };
