const model = require("../models/baiHocModel");
const khoaHocModel = require("../models/khoaHocModel");
const ghiDanhModel = require("../models/ghiDanhModel"); // THÊM

async function layTheoKhoaHoc(req, res) {
  try {
    const khoaHocId = Number(req.params.khoaHocId);

    const kh = await khoaHocModel.layTheoId(khoaHocId);
    if (!kh)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });

    const ds = await model.layTheoKhoaHoc(khoaHocId);
    res.json(ds);
  } catch (err) {
    console.error("LOI baihoc layTheoKhoaHoc:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function layTheoId(req, res) {
  try {
    const bh = await model.layTheoId(req.params.id);
    if (!bh) return res.status(404).json({ message: "Không tìm thấy bài học" });

    // Bài học thử: ai cũng xem được
    if (bh.xemThu) return res.json(bh);

    // Từ đây trở xuống là bài bị khóa
    if (!req.nguoiDung) {
      return res.status(401).json({ message: "Cần đăng nhập để xem bài này" });
    }

    if (req.nguoiDung.vaiTro === "admin") return res.json(bh);

    const duocHoc = await ghiDanhModel.kiemTraDaGhiDanh(
      req.nguoiDung.id,
      bh.khoaHocId,
    );

    if (!duocHoc) {
      return res.status(403).json({ message: "Bạn chưa mua khóa học này" });
    }

    res.json(bh);
  } catch (err) {
    console.error("LOI baihoc layTheoId:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function them(req, res) {
  try {
    const { tieuDe, noiDung, videoUrl, thuTu, thoiLuong, xemThu } = req.body;

    if (!tieuDe) return res.status(400).json({ message: "Thiếu tiêu đề" });

    const khoaHocId = Number(req.params.khoaHocId);
    const kh = await khoaHocModel.layTheoId(khoaHocId);
    if (!kh)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });

    const bh = await model.them({
      khoaHocId,
      tieuDe,
      noiDung,
      videoUrl,
      thuTu,
      thoiLuong,
      xemThu,
    });

    res.status(201).json(bh);
  } catch (err) {
    console.error("LOI baihoc them:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function sua(req, res) {
  try {
    const bh = await model.sua(req.params.id, req.body);
    if (!bh) return res.status(404).json({ message: "Không tìm thấy bài học" });
    res.json(bh);
  } catch (err) {
    console.error("LOI baihoc sua:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function xoa(req, res) {
  try {
    const soDong = await model.xoa(req.params.id);
    if (soDong === 0)
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    res.json({ message: "Đã xóa" });
  } catch (err) {
    console.error("LOI baihoc xoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = { layTheoKhoaHoc, layTheoId, them, sua, xoa };
