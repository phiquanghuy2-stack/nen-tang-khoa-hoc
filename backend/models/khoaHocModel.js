const db = require("../config/db");

async function layTatCa({ capDo } = {}) {
  if (capDo) {
    const [rows] = await db.query(
      "SELECT * FROM khoahoc WHERE capDo = ? ORDER BY ngayTao DESC, id DESC",
      [capDo],
    );
    return rows;
  }

  const [rows] = await db.query(
    "SELECT * FROM khoahoc ORDER BY ngayTao DESC, id DESC",
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
