const jwt = require("jsonwebtoken");

// Có token hợp lệ thì gắn req.nguoiDung. Không có cũng cho đi tiếp.
function xacThucTuyChon(req, res, next) {
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    try {
      const duLieu = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      req.nguoiDung = { id: duLieu.id, vaiTro: duLieu.vaiTro };
    } catch {
      // token hỏng thì coi như khách vãng lai, không chặn
    }
  }

  next();
}

module.exports = xacThucTuyChon;
