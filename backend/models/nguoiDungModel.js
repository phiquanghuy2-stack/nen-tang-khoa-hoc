const db = require("../config/db");

// Không bao giờ trả matKhau ra ngoài, trừ hàm dành riêng cho đăng nhập
const COT_CONG_KHAI = "id, tenDangNhap, email, vaiTro, ngayTao";

async function layTheoId(id) {
  const [rows] = await db.query(
    `SELECT ${COT_CONG_KHAI} FROM nguoidung WHERE id = ?`,
    [id],
  );
  return rows[0];
}

// Chỉ dùng khi đăng nhập — nơi DUY NHẤT matKhau rời khỏi database
async function layTheoEmailKemMatKhau(email) {
  const [rows] = await db.query("SELECT * FROM nguoidung WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

// Trả về 'email', 'tenDangNhap' hoặc null — để controller báo đúng chỗ trùng
async function timChoTrung({ email, tenDangNhap }) {
  const [rows] = await db.query(
    "SELECT email, tenDangNhap FROM nguoidung WHERE email = ? OR tenDangNhap = ?",
    [email, tenDangNhap],
  );

  if (rows.length === 0) return null;
  if (rows.some((d) => d.email === email)) return "email";
  return "tenDangNhap";
}

async function them({ tenDangNhap, email, matKhauDaBam, vaiTro = "user" }) {
  const [kq] = await db.query(
    `INSERT INTO nguoidung (tenDangNhap, email, matKhau, vaiTro)
     VALUES (?, ?, ?, ?)`,
    [tenDangNhap, email, matKhauDaBam, vaiTro],
  );
  return layTheoId(kq.insertId);
}

module.exports = {
  layTheoId,
  layTheoEmailKemMatKhau,
  timChoTrung,
  them,
};
