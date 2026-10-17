import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { dinhDangTien, layCapDo } from "../../lib/hangSo";
import FormKhoaHoc from "../../components/FormKhoaHoc";
import AnhBia from "../../components/AnhBia";
import Icon from "../../components/Icon";
import { DangTai, TrongRong, ThongBao } from "../../components/TrangThai";

function AdminKhoaHoc() {
  const dieuHuong = useNavigate();

  const [ds, setDs] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [moForm, setMoForm] = useState(false);
  const [lanTai, setLanTai] = useState(0);

  useEffect(() => {
    api("/khoahoc?tatCa=1")
      .then(setDs)
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [lanTai]);

  async function taoMoi(duLieu) {
    const kh = await api("/khoahoc", { method: "POST", body: duLieu });
    // Tạo xong chuyển sang trang sửa để thêm bài học luôn
    dieuHuong(`/admin/khoahoc/${kh.id}`);
  }

  async function xoa(kh) {
    if (!confirm(`Xóa "${kh.tieuDe}"? Toàn bộ bài học và ghi danh sẽ mất.`)) {
      return;
    }
    try {
      await api(`/khoahoc/${kh.id}`, { method: "DELETE" });
      setLanTai((n) => n + 1);
    } catch (err) {
      setLoi(err.message);
    }
  }

  if (dangTai) return <DangTai />;

  const soXuatBan = ds.filter((kh) => kh.trangThai === "xuatban").length;

  return (
    <div className="stack">
      <div className="admin-head">
        <div>
          <h1>Khóa học</h1>
          <p>Quản lý toàn bộ khóa học, kể cả bản nháp</p>
        </div>
        {!moForm && (
          <button className="btn btn-primary" onClick={() => setMoForm(true)}>
            <Icon ten="cong" size={16} /> Thêm khóa học
          </button>
        )}
      </div>

      <div className="stat-grid" style={{ marginBottom: 0 }}>
        <div className="card stat">
          <span>Tổng khóa học</span>
          <strong>{ds.length}</strong>
        </div>
        <div className="card stat">
          <span>Đang xuất bản</span>
          <strong>{soXuatBan}</strong>
        </div>
        <div className="card stat">
          <span>Bản nháp</span>
          <strong>{ds.length - soXuatBan}</strong>
        </div>
      </div>

      {loi && <ThongBao>{loi}</ThongBao>}

      {moForm && (
        <div className="card card-pad">
          <h2 className="card-title">Thêm khóa học mới</h2>
          <FormKhoaHoc
            onLuu={taoMoi}
            onHuy={() => setMoForm(false)}
            chuNut="Tạo khóa học"
          />
        </div>
      )}

      <div className="card table-wrap">
        {ds.length === 0 ? (
          <TrongRong
            icon="luoi"
            tieuDe="Chưa có khóa học"
            moTa="Bấm “Thêm khóa học” để tạo khóa đầu tiên."
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Khóa học</th>
                <th>Cấp độ</th>
                <th className="num">Giá</th>
                <th>Trạng thái</th>
                <th className="actions"></th>
              </tr>
            </thead>
            <tbody>
              {ds.map((kh) => (
                <tr key={kh.id}>
                  <td>
                    <Link
                      to={`/admin/khoahoc/${kh.id}`}
                      className="cell-course"
                      style={{ color: "inherit" }}
                    >
                      <AnhBia khoaHoc={kh} />
                      <div>
                        <strong>{kh.tieuDe}</strong>
                        <span className="cell-sub">#{kh.id}</span>
                      </div>
                    </Link>
                  </td>
                  <td>{layCapDo(kh.capDo).ten}</td>
                  <td className="num">
                    {Number(kh.gia) === 0 ? "Miễn phí" : dinhDangTien(kh.gia)}
                  </td>
                  <td>
                    {kh.trangThai === "xuatban" ? (
                      <span className="badge badge-success">Xuất bản</span>
                    ) : (
                      <span className="badge">Nháp</span>
                    )}
                  </td>
                  <td className="actions">
                    <div className="row">
                      <Link
                        to={`/admin/khoahoc/${kh.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Icon ten="but" size={14} /> Sửa
                      </Link>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => xoa(kh)}
                        title="Xóa"
                        aria-label={`Xóa ${kh.tieuDe}`}
                      >
                        <Icon ten="thungRac" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminKhoaHoc;
