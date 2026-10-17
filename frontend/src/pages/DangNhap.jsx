import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { ThongBao } from "../components/TrangThai";

function DangNhap() {
  const { dangNhap } = useAuth();
  const dieuHuong = useNavigate();
  const viTri = useLocation();

  // TuyenRiengTu gửi kèm trang bị chặn — đăng nhập xong quay lại đúng chỗ đó
  const tuDau = viTri.state?.tuDau || "/";

  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loi, setLoi] = useState(null);
  const [dangGui, setDangGui] = useState(false);

  async function xuLyGui(e) {
    e.preventDefault();
    setLoi(null);
    setDangGui(true);

    try {
      await dangNhap(email, matKhau);
      dieuHuong(tuDau, { replace: true });
    } catch (err) {
      setLoi(err.message);
    } finally {
      setDangGui(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="logo-mark">
          <Icon ten="mu" size={22} />
        </div>
        <h1>Chào mừng trở lại</h1>
        <p className="auth-sub">Đăng nhập để tiếp tục việc học của bạn</p>

        <form onSubmit={xuLyGui} className="stack">
          <div className="field">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="ban@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="matKhau" className="field-label">
              Mật khẩu
            </label>
            <input
              id="matKhau"
              type="password"
              className="input"
              placeholder="••••••"
              autoComplete="current-password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
          </div>

          {loi && <ThongBao>{loi}</ThongBao>}

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={dangGui}
          >
            {dangGui ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <p className="auth-foot">
          Chưa có tài khoản?{" "}
          <Link to="/dangky" state={viTri.state}>
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DangNhap;
