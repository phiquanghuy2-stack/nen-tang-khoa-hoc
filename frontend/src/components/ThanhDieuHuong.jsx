import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">
        <Icon ten="mu" size={18} />
      </span>
      <span>
        Edu<span className="logo-accent">Practice</span>
      </span>
    </Link>
  );
}

function ThanhDieuHuong() {
  const { nguoiDung, daDangNhap, laAdmin, dangKiemTra, dangXuat } = useAuth();
  const dieuHuong = useNavigate();

  function xuLyDangXuat() {
    dangXuat();
    dieuHuong("/");
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />

        <nav className="header-nav">
          {dangKiemTra ? null : daDangNhap ? (
            <>
              <NavLink to="/khoahoccuatoi" className="nav-link">
                <Icon ten="sach" size={16} />
                <span className="nav-label">Khóa học của tôi</span>
              </NavLink>
              {laAdmin && (
                <NavLink to="/admin" className="nav-link">
                  <Icon ten="khien" size={16} />
                  <span className="nav-label">Quản trị</span>
                </NavLink>
              )}
              <span className="user-chip" title={nguoiDung.email}>
                <span className="avatar">{nguoiDung.tenDangNhap[0]}</span>
                <span className="user-name">{nguoiDung.tenDangNhap}</span>
              </span>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={xuLyDangXuat}
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <Icon ten="dangXuat" size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/dangnhap" className="btn btn-ghost btn-sm">
                Đăng nhập
              </Link>
              <Link to="/dangky" className="btn btn-primary btn-sm">
                Đăng ký<span className="nav-label">&nbsp;miễn phí</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default ThanhDieuHuong;
