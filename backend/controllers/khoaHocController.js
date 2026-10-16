const model = require("../models/khoaHocModel");

async function layTatCa(req, res) {
  try {
    const ds = await model.layTatCa({ capDo: req.query.capDo });
    res.json(ds);
  } catch (err) {
    console.error("LỖI layTatCa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function layTheoId(req, res) {
  try {
    const kh = await model.layTheoId(req.params.id);
    if (!kh) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    res.json(kh);
  } catch (err) {
    console.error("LỖI layTheoId:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function them(req, res) {
  try {
    const { tieuDe, capDo } = req.body;
    if (!tieuDe || !capDo) {
      return res.status(400).json({ message: "Thiếu tiêu đề hoặc cấp độ" });
    }
    const kh = await model.them(req.body);
    res.status(201).json(kh);
  } catch (err) {
    console.error("LỖI them:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function sua(req, res) {
  try {
    const kh = await model.sua(req.params.id, req.body);
    if (!kh) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    res.json(kh);
  } catch (err) {
    console.error("LỖI sua:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function xoa(req, res) {
  try {
    const soDong = await model.xoa(req.params.id);
    if (soDong === 0) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    res.json({ message: "Đã xóa" });
  } catch (err) {
    console.error("LỖI xoa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = { layTatCa, layTheoId, them, sua, xoa };
