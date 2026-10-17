function chiAdmin(req, res, next) {
  if (!req.nguoiDung) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  if (req.nguoiDung.vaiTro !== "admin") {
    return res.status(403).json({ message: "Không có quyền thực hiện" });
  }

  next();
}

module.exports = chiAdmin;
