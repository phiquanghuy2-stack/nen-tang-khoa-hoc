import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DangTai, TrongRong } from "./TrangThai";

function TuyenRiengTu({ children, canAdmin = false }) {
  const { daDangNhap, laAdmin, dangKiemTra } = useAuth();
  const viTri = useLocation();

  // Chưa biết là ai — chưa được quyết định gì
  if (dangKiemTra) return <DangTai chu="Đang kiểm tra đăng nhập…" />;

  if (!daDangNhap) {
    return (
      <Navigate
        to="/dangnhap"
        state={{ tuDau: viTri.pathname + viTri.search }}
        replace
      />
    );
  }

  if (canAdmin && !laAdmin) {
    return (
      <TrongRong
        icon="khien"
        tieuDe="Không có quyền truy cập"
        moTa="Trang này chỉ dành cho quản trị viên."
      >
        <Link to="/" className="btn btn-secondary">
          Về trang chủ
        </Link>
      </TrongRong>
    );
  }

  return children;
}

export default TuyenRiengTu;
