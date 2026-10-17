import { Routes, Route, Link, Navigate } from "react-router-dom";
import ThanhDieuHuong, { Logo } from "./components/ThanhDieuHuong";
import TuyenRiengTu from "./components/TuyenRiengTu";
import TrangChu from "./pages/TrangChu";
import ChiTietKhoaHoc from "./pages/ChiTietKhoaHoc";
import TrangHoc from "./pages/TrangHoc";
import KhoaHocCuaToi from "./pages/KhoaHocCuaToi";
import DangNhap from "./pages/DangNhap";
import DangKy from "./pages/DangKy";
import BoCucAdmin from "./pages/admin/BoCucAdmin";
import AdminKhoaHoc from "./pages/admin/AdminKhoaHoc";
import AdminSuaKhoaHoc from "./pages/admin/AdminSuaKhoaHoc";
import AdminThanhToan from "./pages/admin/AdminThanhToan";

function KhongTimThay() {
  return (
    <div className="not-found">
      <div className="code">404</div>
      <h1>Không tìm thấy trang</h1>
      <p>Trang bạn tìm không tồn tại hoặc đã bị gỡ.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <ThanhDieuHuong />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/khoahoc/:id" element={<ChiTietKhoaHoc />} />
          <Route path="/dangnhap" element={<DangNhap />} />
          <Route path="/dangky" element={<DangKy />} />

          <Route
            path="/khoahoc/:id/hoc"
            element={
              <TuyenRiengTu>
                <TrangHoc />
              </TuyenRiengTu>
            }
          />
          <Route
            path="/khoahoccuatoi"
            element={
              <TuyenRiengTu>
                <KhoaHocCuaToi />
              </TuyenRiengTu>
            }
          />
          {/* Đường dẫn cũ — chuyển sang đường dẫn mới */}
          <Route
            path="/cuatoi"
            element={<Navigate to="/khoahoccuatoi" replace />}
          />

          <Route
            path="/admin"
            element={
              <TuyenRiengTu canAdmin>
                <BoCucAdmin />
              </TuyenRiengTu>
            }
          >
            <Route index element={<AdminKhoaHoc />} />
            <Route path="khoahoc/:id" element={<AdminSuaKhoaHoc />} />
            <Route path="thanhtoan" element={<AdminThanhToan />} />
          </Route>

          <Route path="*" element={<KhongTimThay />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <Logo />
          <span>
            © {new Date().getFullYear()} EduPractice · Học mọi lúc, mọi nơi
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
