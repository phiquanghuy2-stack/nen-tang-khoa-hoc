const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("../models/nguoiDungModel");

const SO_VONG_BAM = 10;
const HAN_TOKEN = "7d";

function taoToken(nguoiDung) {
  return jwt.sign(
    { id: nguoiDung.id, vaiTro: nguoiDung.vaiTro },
    process.env.JWT_SECRET,
    { expiresIn: HAN_TOKEN },
  );
}

async function dangKy(req, res) {
  try {
    const { tenDangNhap, email, matKhau } = req.body;

    if (!tenDangNhap || !email || !matKhau) {
      return res
        .status(400)
        .json({ message: "Thiếu tên đăng nhập, email hoặc mật khẩu" });
    }

    if (matKhau.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải từ 6 ký tự trở lên" });
    }

    const choTrung = await model.timChoTrung({ email, tenDangNhap });
    if (choTrung === "email") {
      return res.status(409).json({ message: "Email đã được đăng ký" });
    }
    if (choTrung === "tenDangNhap") {
      return res
        .status(409)
        .json({ message: "Tên đăng nhập đã có người dùng" });
    }

    const matKhauDaBam = await bcrypt.hash(matKhau, SO_VONG_BAM);

    // vaiTro KHÔNG lấy từ req.body — mọi người đăng ký đều là 'user'
    const nguoiDung = await model.them({ tenDangNhap, email, matKhauDaBam });

    res.status(201).json({
      nguoiDung,
      token: taoToken(nguoiDung),
    });
  } catch (err) {
    console.error("LOI auth dangKy:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function dangNhap(req, res) {
  try {
    const { email, matKhau } = req.body;

    if (!email || !matKhau) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const nguoiDung = await model.layTheoEmailKemMatKhau(email);
    if (!nguoiDung) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const khop = await bcrypt.compare(matKhau, nguoiDung.matKhau);
    if (!khop) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Bỏ matKhau ra khỏi object trước khi trả về
    const { matKhau: _, ...thongTinCongKhai } = nguoiDung;

    res.json({
      nguoiDung: thongTinCongKhai,
      token: taoToken(nguoiDung),
    });
  } catch (err) {
    console.error("LOI auth dangNhap:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function toiLaAi(req, res) {
  try {
    const nguoiDung = await model.layTheoId(req.nguoiDung.id);
    if (!nguoiDung) {
      return res.status(404).json({ message: "Tài khoản không còn tồn tại" });
    }
    res.json(nguoiDung);
  } catch (err) {
    console.error("LOI auth toiLaAi:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = { dangKy, dangNhap, toiLaAi };
