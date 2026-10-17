const db = require("../config/db");

// chiXuatBan = true: khách chỉ thấy khóa đã xuất bản, không thấy bản nháp
async function layTatCa({ capDo, chiXuatBan = true } = {}) {
  const dieuKien = [];
  const thamSo = [];

  if (capDo) {
    dieuKien.push("capDo = ?");
    thamSo.push(capDo);
  }
  if (chiXuatBan) {
    dieuKien.push("trangThai = 'xuatban'");
  }

  const where = dieuKien.length ? `WHERE ${dieuKien.join(" AND ")}` : "";

  const [rows] = await db.query(
    `SELECT * FROM khoahoc ${where} ORDER BY ngayTao DESC, id DESC`,
    thamSo,
  );
  return rows;
}

async function layTheoId(id) {
  const [rows] = await db.query("SELECT * FROM khoahoc WHERE id = ?", [id]);
  return rows[0];
}

async function them({
  tieuDe,
  moTa = null,
  gia = 0,
  anhBia = null,
  capDo,
  trangThai = "nhap",
}) {
  const [kq] = await db.query(
    `INSERT INTO khoahoc (tieuDe, moTa, gia, anhBia, capDo, trangThai)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tieuDe, moTa, gia, anhBia, capDo, trangThai],
  );

  return layTheoId(kq.insertId);
}

async function sua(id, duLieu) {
  const hienTai = await layTheoId(id);
  if (!hienTai) return undefined;

  const moi = { ...hienTai, ...duLieu };

  await db.query(
    `UPDATE khoahoc
     SET tieuDe = ?, moTa = ?, gia = ?, anhBia = ?, capDo = ?, trangThai = ?
     WHERE id = ?`,
    [moi.tieuDe, moi.moTa, moi.gia, moi.anhBia, moi.capDo, moi.trangThai, id],
  );

  return layTheoId(id);
}

async function xoa(id) {
  const [kq] = await db.query("DELETE FROM khoahoc WHERE id = ?", [id]);
  return kq.affectedRows;
}

module.exports = { layTatCa, layTheoId, them, sua, xoa };
