const model = require("../models/ghiDanhModel");
const khoaHocModel = require("../models/khoaHocModel");

const CAC_TRANG_THAI = ["cho", "daThanhToan", "tuChoi"];

// Thông tin để học viên chuyển khoản. Nội dung "EDU<id>" giúp admin
// đối chiếu sao kê ngân hàng với đúng lượt ghi danh.
function thongTinThanhToan(gd, kh) {
  const { NGAN_HANG, SO_TAI_KHOAN, TEN_TAI_KHOAN } = process.env;
  const noiDung = `EDU${gd.id}`;

  let qrUrl = null;
  if (NGAN_HANG && SO_TAI_KHOAN) {
    const thamSo = new URLSearchParams({
      amount: kh.gia,
      addInfo: noiDung,
      accountName: TEN_TAI_KHOAN || "",
    });
    qrUrl = `https://img.vietqr.io/image/${NGAN_HANG}-${SO_TAI_KHOAN}-compact2.png?${thamSo}`;
  }

  return {
    nganHang: NGAN_HANG || null,
    soTaiKhoan: SO_TAI_KHOAN || null,
    tenTaiKhoan: TEN_TAI_KHOAN || null,
    soTien: kh.gia,
    noiDung,
    qrUrl,
  };
}

async function khoaHocCuaToi(req, res) {
  try {
    const ds = await model.layTheoNguoiDung(req.nguoiDung.id);
    res.json(ds);
  } catch (err) {
    console.error("LOI ghidanh khoaHocCuaToi:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function trangThaiCuaToi(req, res) {
  try {
    const khoaHocId = Number(req.params.khoaHocId);

    const gd = await model.layTheoNguoiVaKhoa(req.nguoiDung.id, khoaHocId);

    const kq = {
      daGhiDanh: !!gd,
      trangThaiThanhToan: gd ? gd.trangThaiThanhToan : null,
      duocHoc: gd?.trangThaiThanhToan === "daThanhToan",
      thanhToan: null,
    };

    // Chưa thanh toán xong thì gửi kèm thông tin chuyển khoản
    if (gd && !kq.duocHoc) {
      const kh = await khoaHocModel.layTheoId(khoaHocId);
      kq.thanhToan = thongTinThanhToan(gd, kh);
    }

    res.json(kq);
  } catch (err) {
    console.error("LOI ghidanh trangThaiCuaToi:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function ghiDanh(req, res) {
  try {
    const khoaHocId = Number(req.body.khoaHocId);

    if (!khoaHocId) {
      return res.status(400).json({ message: "Thiếu khoaHocId" });
    }

    const kh = await khoaHocModel.layTheoId(khoaHocId);
    if (!kh) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    if (kh.trangThai !== "xuatban") {
      return res.status(400).json({ message: "Khóa học chưa mở bán" });
    }

    const daCo = await model.layTheoNguoiVaKhoa(req.nguoiDung.id, khoaHocId);

    // Bị từ chối (vd chuyển thiếu tiền) thì cho gửi lại yêu cầu
    if (daCo?.trangThaiThanhToan === "tuChoi") {
      await model.doiTrangThai(daCo.id, "cho");
      const gd = await model.layTheoId(daCo.id);
      return res.json({ ...gd, thanhToan: thongTinThanhToan(gd, kh) });
    }

    if (daCo) {
      return res.status(409).json({
        message: "Bạn đã đăng ký khóa học này",
        trangThaiThanhToan: daCo.trangThaiThanhToan,
      });
    }

    // Khóa miễn phí thì vào học ngay, còn lại chờ admin xác nhận chuyển khoản
    const gd = await model.them({
      nguoiDungId: req.nguoiDung.id,
      khoaHocId,
      trangThaiThanhToan: kh.gia > 0 ? "cho" : "daThanhToan",
    });

    res.status(201).json({
      ...gd,
      thanhToan: gd.trangThaiThanhToan === "cho" ? thongTinThanhToan(gd, kh) : null,
    });
  } catch (err) {
    console.error("LOI ghidanh ghiDanh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// ===== Dành cho admin =====

async function layTatCa(req, res) {
  try {
    const { trangThai } = req.query;
    if (trangThai && !CAC_TRANG_THAI.includes(trangThai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const ds = await model.layTatCa({ trangThaiThanhToan: trangThai });
    res.json(ds);
  } catch (err) {
    console.error("LOI ghidanh layTatCa:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function doiTrangThai(req, res) {
  try {
    const { trangThaiThanhToan } = req.body;
    if (!CAC_TRANG_THAI.includes(trangThaiThanhToan)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const soDong = await model.doiTrangThai(req.params.id, trangThaiThanhToan);
    if (soDong === 0) {
      return res.status(404).json({ message: "Không tìm thấy lượt ghi danh" });
    }

    res.json(await model.layTheoId(req.params.id));
  } catch (err) {
    console.error("LOI ghidanh doiTrangThai:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  khoaHocCuaToi,
  trangThaiCuaToi,
  ghiDanh,
  layTatCa,
  doiTrangThai,
};
