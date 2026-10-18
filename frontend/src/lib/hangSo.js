export const DANH_SACH_CAP_DO = [
  { ma: "lop10", ten: "Lớp 10", ngan: "10", mau: ["#10b981", "#047857"] },
  { ma: "lop11", ten: "Lớp 11", ngan: "11", mau: ["#14b8a6", "#0f766e"] },
  { ma: "lop12", ten: "Lớp 12", ngan: "12", mau: ["#22c55e", "#15803d"] },
  { ma: "sinhvien", ten: "Sinh viên", ngan: "SV", mau: ["#06b6d4", "#0d9488"] },
  { ma: "toeic", ten: "TOEIC", ngan: "TOEIC", mau: ["#84cc16", "#16a34a"] },
  { ma: "ielts", ten: "IELTS", ngan: "IELTS", mau: ["#059669", "#065f46"] },
  { ma: "tuduy", ten: "Tư duy", ngan: "Tư duy", mau: ["#65a30d", "#3f6212"] },
];

export function layCapDo(ma) {
  return (
    DANH_SACH_CAP_DO.find((c) => c.ma === ma) || {
      ma,
      ten: ma,
      ngan: ma,
      mau: ["#64748b", "#475569"],
    }
  );
}

export const TEN_TRANG_THAI_THANH_TOAN = {
  cho: "Chờ xác nhận",
  daThanhToan: "Đã thanh toán",
  tuChoi: "Bị từ chối",
};

export const MAU_TRANG_THAI_THANH_TOAN = {
  cho: "badge-warning",
  daThanhToan: "badge-success",
  tuChoi: "badge-danger",
};

export const TEN_TRANG_THAI_KHOA_HOC = {
  nhap: "Nháp",
  xuatban: "Xuất bản",
};

export function dinhDangTien(so) {
  return Number(so).toLocaleString("vi-VN") + "đ";
}

export function dinhDangThoiLuong(giay) {
  if (!giay) return null;
  const phut = Math.floor(giay / 60);
  const du = giay % 60;
  return `${phut}:${String(du).padStart(2, "0")}`;
}

export function dinhDangTongThoiGian(giay) {
  if (!giay) return "0 phút";
  const gio = Math.floor(giay / 3600);
  const phut = Math.round((giay % 3600) / 60);
  return gio > 0 ? `${gio} giờ ${phut} phút` : `${phut} phút`;
}
