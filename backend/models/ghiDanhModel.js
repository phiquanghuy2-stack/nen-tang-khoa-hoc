const db = require("../config/db");

async function kiemTraDaGhiDanh(nguoiDungId, khoaHocId) {
  const [rows] = await db.query(
    `SELECT id FROM ghidanh
     WHERE nguoiDungId = ? AND khoaHocId = ?
       AND trangThaiThanhToan = 'daThanhToan'`,
    [nguoiDungId, khoaHocId],
  );
  return rows.length > 0;
}

async function layTheoNguoiVaKhoa(nguoiDungId, khoaHocId) {
  const [rows] = await db.query(
    "SELECT * FROM ghidanh WHERE nguoiDungId = ? AND khoaHocId = ?",
    [nguoiDungId, khoaHocId],
  );
  return rows[0];
}

async function layTheoNguoiDung(nguoiDungId) {
  const [rows] = await db.query(
    `SELECT
       g.id, g.trangThaiThanhToan, g.ngayDangKy,
       k.id AS khoaHocId, k.tieuDe, k.moTa, k.gia, k.anhBia, k.capDo
     FROM ghidanh g
     JOIN khoahoc k ON k.id = g.khoaHocId
     WHERE g.nguoiDungId = ?
     ORDER BY g.ngayDangKy DESC`,
    [nguoiDungId],
  );
  return rows;
}

async function layTheoId(id) {
  const [rows] = await db.query("SELECT * FROM ghidanh WHERE id = ?", [id]);
  return rows[0];
}

// Cho admin: kèm tên người mua và khóa học, lọc được theo trạng thái
async function layTatCa({ trangThaiThanhToan } = {}) {
  const dieuKien = trangThaiThanhToan ? "WHERE g.trangThaiThanhToan = ?" : "";
  const [rows] = await db.query(
    `SELECT
       g.id, g.trangThaiThanhToan, g.ngayDangKy,
       n.id AS nguoiDungId, n.tenDangNhap, n.email,
       k.id AS khoaHocId, k.tieuDe, k.gia
     FROM ghidanh g
     JOIN nguoidung n ON n.id = g.nguoiDungId
     JOIN khoahoc k ON k.id = g.khoaHocId
     ${dieuKien}
     ORDER BY g.ngayDangKy DESC, g.id DESC`,
    trangThaiThanhToan ? [trangThaiThanhToan] : [],
  );
  return rows;
}

async function them({ nguoiDungId, khoaHocId, trangThaiThanhToan = "cho" }) {
  const [kq] = await db.query(
    `INSERT INTO ghidanh (nguoiDungId, khoaHocId, trangThaiThanhToan)
     VALUES (?, ?, ?)`,
    [nguoiDungId, khoaHocId, trangThaiThanhToan],
  );
  return layTheoId(kq.insertId);
}

async function doiTrangThai(id, trangThaiThanhToan) {
  const [kq] = await db.query(
    "UPDATE ghidanh SET trangThaiThanhToan = ? WHERE id = ?",
    [trangThaiThanhToan, id],
  );
  return kq.affectedRows;
}

module.exports = {
  kiemTraDaGhiDanh,
  layTheoNguoiVaKhoa,
  layTheoNguoiDung,
  layTheoId,
  layTatCa,
  them,
  doiTrangThai,
};
