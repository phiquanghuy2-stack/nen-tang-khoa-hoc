import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { dinhDangThoiLuong } from "../../lib/hangSo";
import FormKhoaHoc from "../../components/FormKhoaHoc";
import FormBaiHoc from "../../components/FormBaiHoc";
import Icon from "../../components/Icon";
import { DangTai, TrongRong, ThongBao } from "../../components/TrangThai";

function AdminSuaKhoaHoc() {
  const { id } = useParams();

  const [khoaHoc, setKhoaHoc] = useState(null);
  const [baiHoc, setBaiHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [thongBao, setThongBao] = useState(null);

  // null = không sửa bài nào; "moi" = đang thêm; object = đang sửa bài đó
  const [baiDangSua, setBaiDangSua] = useState(null);
  const [lanTaiBai, setLanTaiBai] = useState(0);

  useEffect(() => {
    api(`/khoahoc/${id}`)
      .then(setKhoaHoc)
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [id]);

  useEffect(() => {
    api(`/khoahoc/${id}/baihoc`)
      .then(setBaiHoc)
      .catch((err) => setLoi(err.message));
  }, [id, lanTaiBai]);

  async function luuKhoaHoc(duLieu) {
    const kh = await api(`/khoahoc/${id}`, { method: "PUT", body: duLieu });
    setKhoaHoc(kh);
    setThongBao("Đã lưu thay đổi khóa học");
    setTimeout(() => setThongBao(null), 2500);
  }

  async function batDauSuaBai(bai) {
    // Danh sách bài bị giấu noiDung/videoUrl — lấy bản đầy đủ (admin được xem)
    try {
      setBaiDangSua(await api(`/baihoc/${bai.id}`));
    } catch (err) {
      setLoi(err.message);
    }
  }

  async function luuBai(duLieu) {
    if (baiDangSua === "moi") {
      await api(`/khoahoc/${id}/baihoc`, { method: "POST", body: duLieu });
    } else {
      await api(`/baihoc/${baiDangSua.id}`, { method: "PUT", body: duLieu });
    }
    setBaiDangSua(null);
    setLanTaiBai((n) => n + 1);
  }

  async function xoaBai(bai) {
    if (!confirm(`Xóa bài "${bai.tieuDe}"?`)) return;
    try {
      await api(`/baihoc/${bai.id}`, { method: "DELETE" });
      setLanTaiBai((n) => n + 1);
    } catch (err) {
      setLoi(err.message);
    }
  }

  if (dangTai) return <DangTai />;
  if (!khoaHoc) return <ThongBao>{loi || "Không tìm thấy khóa học"}</ThongBao>;

  return (
    <div className="stack">
      <nav className="breadcrumb">
        <Link to="/admin">
          <Icon ten="traiTen" size={14} /> Khóa học
        </Link>
        <span>/</span>
        <span>#{khoaHoc.id}</span>
      </nav>

      <div className="admin-head" style={{ marginBottom: 0 }}>
        <div>
          <h1>{khoaHoc.tieuDe}</h1>
          <p>
            {khoaHoc.trangThai === "xuatban" ? (
              <span className="badge badge-success">Xuất bản</span>
            ) : (
              <span className="badge">Nháp — học viên chưa thấy</span>
            )}
          </p>
        </div>
        <Link to={`/khoahoc/${id}`} className="btn btn-secondary">
          <Icon ten="mat" size={16} /> Xem như học viên
        </Link>
      </div>

      {loi && <ThongBao>{loi}</ThongBao>}

      <div className="card card-pad">
        <h2 className="card-title">Thông tin khóa học</h2>
        <FormKhoaHoc
          key={khoaHoc.id}
          giaTriBanDau={khoaHoc}
          onLuu={luuKhoaHoc}
          chuNut="Lưu thay đổi"
        />
        {thongBao && (
          <div style={{ marginTop: 14 }}>
            <ThongBao loai="success">{thongBao}</ThongBao>
          </div>
        )}
      </div>

      <div className="card curriculum">
        <div className="curriculum-head">
          <h2>Bài học ({baiHoc.length})</h2>
          {!baiDangSua && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setBaiDangSua("moi")}
            >
              <Icon ten="cong" size={14} /> Thêm bài học
            </button>
          )}
        </div>

        {baiDangSua && (
          <div
            className="card-pad"
            style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
            }}
          >
            <h3 className="card-title">
              {baiDangSua === "moi"
                ? "Thêm bài học mới"
                : `Sửa: ${baiDangSua.tieuDe}`}
            </h3>
            <FormBaiHoc
              key={baiDangSua === "moi" ? "moi" : baiDangSua.id}
              giaTriBanDau={baiDangSua === "moi" ? null : baiDangSua}
              onLuu={luuBai}
              onHuy={() => setBaiDangSua(null)}
              chuNut={baiDangSua === "moi" ? "Thêm bài" : "Lưu bài"}
            />
          </div>
        )}

        {baiHoc.length === 0 ? (
          <TrongRong
            tieuDe="Chưa có bài học"
            moTa="Thêm bài đầu tiên — nên bật “học thử” cho bài 1 để thu hút học viên."
          />
        ) : (
          baiHoc.map((bai) => (
            <div key={bai.id} className="lesson-row">
              <span className="lesson-num">{bai.thuTu}</span>
              <span className="lesson-title">{bai.tieuDe}</span>
              {!!bai.xemThu && (
                <span className="badge badge-primary">Học thử</span>
              )}
              {bai.thoiLuong > 0 && (
                <span className="lesson-time">
                  {dinhDangThoiLuong(bai.thoiLuong)}
                </span>
              )}
              <div className="row" style={{ flexWrap: "nowrap" }}>
                <button
                  className="btn btn-secondary btn-sm btn-icon"
                  onClick={() => batDauSuaBai(bai)}
                  title="Sửa"
                  aria-label={`Sửa ${bai.tieuDe}`}
                >
                  <Icon ten="but" size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm btn-icon"
                  onClick={() => xoaBai(bai)}
                  title="Xóa"
                  aria-label={`Xóa ${bai.tieuDe}`}
                >
                  <Icon ten="thungRac" size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminSuaKhoaHoc;
