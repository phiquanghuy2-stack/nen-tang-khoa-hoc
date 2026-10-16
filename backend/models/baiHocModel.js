const db = require("../config/db");

// Danh sách bài: không trả noiDung.
// videoUrl chỉ trả khi bài được đánh dấu xemThu, còn lại trả NULL.
const SELECT_CONG_KHAI = `
  id,
  khoaHocId,
  tieuDe,
  thuTu,
  thoiLuong,
  xemThu,
  CASE WHEN xemThu THEN videoUrl ELSE NULL END AS videoUrl
`;

async function layTheoKhoaHoc(khoaHocId) {
  const [rows] = await db.query(
    `SELECT ${SELECT_CONG_KHAI}
     FROM baihoc
     WHERE khoaHocId = ?
     ORDER BY thuTu ASC, id ASC`,
    [khoaHocId],
  );
  return rows;
}

async function layTheoId(id) {
  const [rows] = await db.query("SELECT * FROM baihoc WHERE id = ?", [id]);
  return rows[0];
}

async function thuTuTiepTheo(khoaHocId) {
  const [rows] = await db.query(
    "SELECT COALESCE(MAX(thuTu), 0) + 1 AS keTiep FROM baihoc WHERE khoaHocId = ?",
    [khoaHocId],
  );
  return rows[0].keTiep;
}

async function them({
  khoaHocId,
  tieuDe,
  noiDung = null,
  videoUrl = null,
  thuTu,
  thoiLuong = 0,
  xemThu = false,
}) {
  const viTri = thuTu ?? (await thuTuTiepTheo(khoaHocId));

  const [kq] = await db.query(
    `INSERT INTO baihoc
       (khoaHocId, tieuDe, noiDung, videoUrl, thuTu, thoiLuong, xemThu)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [khoaHocId, tieuDe, noiDung, videoUrl, viTri, thoiLuong, xemThu],
  );

  return layTheoId(kq.insertId);
}

async function sua(id, duLieu) {
  const hienTai = await layTheoId(id);
  if (!hienTai) return undefined;

  const moi = { ...hienTai, ...duLieu };

  await db.query(
    `UPDATE baihoc
     SET tieuDe = ?, noiDung = ?, videoUrl = ?,
         thuTu = ?, thoiLuong = ?, xemThu = ?
     WHERE id = ?`,
    [
      moi.tieuDe,
      moi.noiDung,
      moi.videoUrl,
      moi.thuTu,
      moi.thoiLuong,
      moi.xemThu,
      id,
    ],
  );

  return layTheoId(id);
}

async function xoa(id) {
  const [kq] = await db.query("DELETE FROM baihoc WHERE id = ?", [id]);
  return kq.affectedRows;
}

module.exports = { layTheoKhoaHoc, layTheoId, them, sua, xoa };
