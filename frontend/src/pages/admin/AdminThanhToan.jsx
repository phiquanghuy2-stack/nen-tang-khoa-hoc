import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { api } from "../../lib/api";
import {
  dinhDangTien,
  TEN_TRANG_THAI_THANH_TOAN,
  MAU_TRANG_THAI_THANH_TOAN,
} from "../../lib/hangSo";
import Icon from "../../components/Icon";
import { DangTai, TrongRong, ThongBao } from "../../components/TrangThai";

const CAC_TAB = [
  { ma: "cho", ten: "Chờ xác nhận" },
  { ma: "daThanhToan", ten: "Đã thanh toán" },
  { ma: "tuChoi", ten: "Bị từ chối" },
  { ma: "", ten: "Tất cả" },
];

function AdminThanhToan() {
  const { taiLaiSoCho } = useOutletContext();

  const [loc, setLoc] = useState("cho");
  const [ds, setDs] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [lanTai, setLanTai] = useState(0);
  const [dangXuLy, setDangXuLy] = useState(null);

  useEffect(() => {
    const duongDan = loc ? `/ghidanh?trangThai=${loc}` : "/ghidanh";
    api(duongDan)
      .then((kq) => {
        setDs(kq);
        setLoi(null);
      })
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [loc, lanTai]);

  async function doiTrangThai(gd, trangThaiThanhToan) {
    const hanhDong =
      trangThaiThanhToan === "daThanhToan" ? "Xác nhận đã nhận tiền" : "Từ chối";
    if (!confirm(`${hanhDong} cho EDU${gd.id} (${gd.tenDangNhap})?`)) return;

    setDangXuLy(gd.id);
    try {
      await api(`/ghidanh/${gd.id}/trangthai`, {
        method: "PUT",
        body: { trangThaiThanhToan },
      });
      setLanTai((n) => n + 1);
      taiLaiSoCho();
    } catch (err) {
      setLoi(err.message);
    } finally {
      setDangXuLy(null);
    }
  }

  const tongTien = ds.reduce((t, gd) => t + Number(gd.gia), 0);

  return (
    <div className="stack">
      <div className="admin-head" style={{ marginBottom: 0 }}>
        <div>
          <h1>Duyệt thanh toán</h1>
          <p>
            Đối chiếu nội dung chuyển khoản <strong>EDU…</strong> với sao kê
            ngân hàng rồi xác nhận
          </p>
        </div>
      </div>

      <div className="tabs" role="tablist" style={{ marginBottom: 0 }}>
        {CAC_TAB.map((t) => (
          <button
            key={t.ma}
            role="tab"
            aria-selected={loc === t.ma}
            className={`tab ${loc === t.ma ? "active" : ""}`}
            onClick={() => setLoc(t.ma)}
          >
            {t.ten}
          </button>
        ))}
      </div>

      {loi && <ThongBao>{loi}</ThongBao>}

      {dangTai ? (
        <DangTai />
      ) : (
        <div className="card table-wrap">
          {ds.length === 0 ? (
            <TrongRong
              icon={loc === "cho" ? "dung" : "the"}
              tieuDe={
                loc === "cho" ? "Không còn lượt nào chờ duyệt" : "Trống"
              }
              moTa={loc === "cho" ? "Mọi thanh toán đã được xử lý." : null}
            />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nội dung CK</th>
                  <th>Học viên</th>
                  <th>Khóa học</th>
                  <th className="num">Số tiền</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th className="actions"></th>
                </tr>
              </thead>
              <tbody>
                {ds.map((gd) => (
                  <tr key={gd.id}>
                    <td>
                      <span className="pay-code">
                        <strong>EDU{gd.id}</strong>
                      </span>
                    </td>
                    <td>
                      <strong>{gd.tenDangNhap}</strong>
                      <div className="cell-sub">{gd.email}</div>
                    </td>
                    <td>
                      <Link to={`/admin/khoahoc/${gd.khoaHocId}`}>
                        {gd.tieuDe}
                      </Link>
                    </td>
                    <td className="num">
                      <strong>{dinhDangTien(gd.gia)}</strong>
                    </td>
                    <td className="cell-sub">
                      {new Date(gd.ngayDangKy).toLocaleString("vi-VN")}
                    </td>
                    <td>
                      <span
                        className={`badge ${MAU_TRANG_THAI_THANH_TOAN[gd.trangThaiThanhToan] || ""}`}
                      >
                        {TEN_TRANG_THAI_THANH_TOAN[gd.trangThaiThanhToan]}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="row">
                        {gd.trangThaiThanhToan !== "daThanhToan" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => doiTrangThai(gd, "daThanhToan")}
                            disabled={dangXuLy === gd.id}
                          >
                            <Icon ten="dung" size={14} /> Duyệt
                          </button>
                        )}
                        {gd.trangThaiThanhToan !== "tuChoi" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => doiTrangThai(gd, "tuChoi")}
                            disabled={dangXuLy === gd.id}
                          >
                            <Icon ten="dauX" size={14} /> Từ chối
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!dangTai && ds.length > 0 && (
        <p className="muted small">
          {ds.length} lượt · tổng {dinhDangTien(tongTien)}
        </p>
      )}
    </div>
  );
}

export default AdminThanhToan;
