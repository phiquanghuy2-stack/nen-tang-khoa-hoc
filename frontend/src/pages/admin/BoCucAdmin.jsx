import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "../../lib/api";
import Icon from "../../components/Icon";

function BoCucAdmin() {
  const [soCho, setSoCho] = useState(0);

  // Trang con gọi lại hàm này sau khi duyệt/từ chối để cập nhật số trên menu
  const taiLaiSoCho = useCallback(() => {
    api("/ghidanh?trangThai=cho")
      .then((ds) => setSoCho(ds.length))
      .catch(() => {});
  }, []);

  useEffect(taiLaiSoCho, [taiLaiSoCho]);

  // Trang sửa khóa học (/admin/khoahoc/:id) vẫn tính là mục "Khóa học"
  const { pathname } = useLocation();
  const dangOKhoaHoc =
    pathname === "/admin" || pathname.startsWith("/admin/khoahoc");

  return (
    <div className="container">
      <div className="admin-layout">
        <aside className="card admin-side">
          <div className="admin-side-title">Quản trị</div>
          <Link
            to="/admin"
            className={`nav-link ${dangOKhoaHoc ? "active" : ""}`}
          >
            <Icon ten="luoi" size={16} /> Khóa học
          </Link>
          <NavLink to="/admin/thanhtoan" className="nav-link">
            <Icon ten="the" size={16} /> Duyệt thanh toán
            {soCho > 0 && (
              <span className="badge badge-warning" style={{ marginLeft: "auto" }}>
                {soCho}
              </span>
            )}
          </NavLink>
        </aside>

        <div>
          <Outlet context={{ taiLaiSoCho }} />
        </div>
      </div>
    </div>
  );
}

export default BoCucAdmin;
