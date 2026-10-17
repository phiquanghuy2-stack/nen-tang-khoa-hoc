import { useState } from "react";
import { dinhDangTien } from "../lib/hangSo";
import Icon from "./Icon";

function NutSaoChep({ giaTri }) {
  const [daChep, setDaChep] = useState(false);

  async function chep() {
    try {
      await navigator.clipboard.writeText(String(giaTri));
      setDaChep(true);
      setTimeout(() => setDaChep(false), 1500);
    } catch {
      // Trình duyệt chặn clipboard thì thôi
    }
  }

  return (
    <button
      type="button"
      className="copy-btn"
      onClick={chep}
      title="Sao chép"
      aria-label="Sao chép"
    >
      <Icon ten={daChep ? "dung" : "saoChep"} size={13} />
    </button>
  );
}

// Hiện QR + thông tin chuyển khoản cho một lượt ghi danh đang chờ
function ThongTinThanhToan({ thanhToan }) {
  if (!thanhToan) return null;

  return (
    <div className="pay-box">
      <div className="pay-box-head">
        <Icon ten="dongHo" size={16} />
        Đang chờ xác nhận thanh toán
      </div>

      {thanhToan.qrUrl && (
        <div className="pay-qr">
          <img src={thanhToan.qrUrl} alt="Mã QR chuyển khoản" />
        </div>
      )}

      <div className="pay-rows">
        {thanhToan.nganHang && (
          <div className="pay-row">
            <span>Ngân hàng</span>
            <strong>{thanhToan.nganHang}</strong>
          </div>
        )}
        {thanhToan.soTaiKhoan && (
          <div className="pay-row">
            <span>Số tài khoản</span>
            <strong>
              {thanhToan.soTaiKhoan} <NutSaoChep giaTri={thanhToan.soTaiKhoan} />
            </strong>
          </div>
        )}
        {thanhToan.tenTaiKhoan && (
          <div className="pay-row">
            <span>Chủ tài khoản</span>
            <strong>{thanhToan.tenTaiKhoan}</strong>
          </div>
        )}
        <div className="pay-row">
          <span>Số tiền</span>
          <strong>
            {dinhDangTien(thanhToan.soTien)}{" "}
            <NutSaoChep giaTri={thanhToan.soTien} />
          </strong>
        </div>
        <div className="pay-row">
          <span>Nội dung</span>
          <strong>
            <span className="pay-code">{thanhToan.noiDung}</span>
            <NutSaoChep giaTri={thanhToan.noiDung} />
          </strong>
        </div>
      </div>

      <p className="pay-note">
        {thanhToan.qrUrl
          ? "Quét mã bằng app ngân hàng — số tiền và nội dung đã điền sẵn. "
          : "Hệ thống chưa cấu hình tài khoản nhận tiền, vui lòng liên hệ quản trị viên. "}
        Khóa học được mở sau khi quản trị viên xác nhận đã nhận tiền.
      </p>
    </div>
  );
}

export default ThongTinThanhToan;
