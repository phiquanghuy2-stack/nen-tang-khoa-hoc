const jwt = require("jsonwebtoken");

function xacThuc(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const token = header.slice(7); // bỏ 7 ký tự "Bearer "

  try {
    const duLieu = jwt.verify(token, process.env.JWT_SECRET);
    req.nguoiDung = { id: duLieu.id, vaiTro: duLieu.vaiTro };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn" });
    }
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

module.exports = xacThuc;
