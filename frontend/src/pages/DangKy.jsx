import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { ThongBao } from "../components/TrangThai";

function DangKy() {
  const { dangKy } = useAuth();
  const dieuHuong = useNavigate();
  const viTri = useLocation();
  const tuDau = viTri.state?.tuDau || "/";

  const [tenDangNhap, setTenDangNhap] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loi, setLoi] = useState(null);
  const [dangGui, setDangGui] = useState(false);

  async function xuLyGui(e) {
    e.preventDefault();
    setLoi(null);

    if (matKhau.length < 6) {
      setLoi("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }

    setDangGui(true);
    try {
      await dangKy(tenDangNhap, email, matKhau);
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
        <h1>Tạo tài khoản</h1>
        <p className="auth-sub">Miễn phí — học thử ngay sau khi đăng ký</p>

        <form onSubmit={xuLyGui} className="stack">
          <div className="field">
            <label htmlFor="tenDangNhap" className="field-label">
              Tên đăng nhập
            </label>
            <input
              id="tenDangNhap"
              className="input"
              placeholder="vd: huyphi"
              autoComplete="username"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              required
            />
          </div>

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
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
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
            {dangGui ? "Đang tạo tài khoản…" : "Đăng ký"}
          </button>
        </form>

        <p className="auth-foot">
          Đã có tài khoản?{" "}
          <Link to="/dangnhap" state={viTri.state}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DangKy;
