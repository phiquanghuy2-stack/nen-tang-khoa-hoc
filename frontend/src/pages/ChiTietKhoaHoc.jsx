import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  dinhDangTien,
  dinhDangThoiLuong,
  dinhDangTongThoiGian,
  layCapDo,
} from "../lib/hangSo";
import ThongTinThanhToan from "../components/ThongTinThanhToan";
import AnhBia from "../components/AnhBia";
import Icon from "../components/Icon";
import { DangTai, TrongRong, ThongBao } from "../components/TrangThai";

function ChiTietKhoaHoc() {
  const { id } = useParams();
  const dieuHuong = useNavigate();
  const { daDangNhap, laAdmin, dangKiemTra } = useAuth();

  const [khoaHoc, setKhoaHoc] = useState(null);
  const [baiHoc, setBaiHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

  // { daGhiDanh, trangThaiThanhToan, duocHoc, thanhToan } — null khi chưa đăng nhập
  const [trangThai, setTrangThai] = useState(null);
  const [dangMua, setDangMua] = useState(false);
  const [loiMua, setLoiMua] = useState(null);

  useEffect(() => {
    Promise.all([api(`/khoahoc/${id}`), api(`/khoahoc/${id}/baihoc`)])
      .then(([kh, ds]) => {
        setKhoaHoc(kh);
        setBaiHoc(ds);
        setLoi(null);
      })
      .catch((err) =>
        setLoi(
          err.status === 404
            ? "Không tìm thấy khóa học"
            : "Không tải được khóa học",
        ),
      )
      .finally(() => setDangTai(false));
  }, [id]);

  // Chờ AuthContext kiểm tra xong token rồi mới hỏi trạng thái ghi danh
  useEffect(() => {
    if (dangKiemTra || !daDangNhap) return;
    api(`/ghidanh/trangthai/${id}`)
      .then(setTrangThai)
      .catch(() => setTrangThai(null));
  }, [id, daDangNhap, dangKiemTra]);

  async function xuLyMua() {
    if (!daDangNhap) {
      dieuHuong("/dangnhap", { state: { tuDau: `/khoahoc/${id}` } });
      return;
    }

    setDangMua(true);
    setLoiMua(null);
    try {
      await api("/ghidanh", {
        method: "POST",
        body: { khoaHocId: Number(id) },
      });
      setTrangThai(await api(`/ghidanh/trangthai/${id}`));
    } catch (err) {
      setLoiMua(err.message);
    } finally {
      setDangMua(false);
    }
  }

  if (dangTai) return <DangTai />;

  if (loi) {
    return (
      <div className="container">
        <TrongRong icon="canhBao" tieuDe={loi}>
          <Link to="/" className="btn btn-secondary">
            <Icon ten="traiTen" size={16} /> Về trang chủ
          </Link>
        </TrongRong>
      </div>
    );
  }

  // Đăng xuất thì bỏ qua trạng thái cũ còn lưu trong state
  const tt = daDangNhap ? trangThai : null;
  const duocHoc = laAdmin || !!tt?.duocHoc;
  const mienPhi = Number(khoaHoc.gia) === 0;
  const tongThoiGian = baiHoc.reduce((t, b) => t + (b.thoiLuong || 0), 0);
  const soBaiThu = baiHoc.filter((b) => b.xemThu).length;
  const duongDanHoc = `/khoahoc/${id}/hoc`;

  function khuVucMua() {
    if (duocHoc) {
      return (
        <>
          <ThongBao loai="success">
            {laAdmin
              ? "Bạn là quản trị viên — xem được mọi bài."
              : "Bạn đã sở hữu khóa học này."}
          </ThongBao>
          <Link to={duongDanHoc} className="btn btn-primary btn-lg btn-block">
            <Icon ten="phat" size={18} /> Vào học
          </Link>
        </>
      );
    }

    if (tt?.trangThaiThanhToan === "cho") {
      return <ThongTinThanhToan thanhToan={tt.thanhToan} />;
    }

    if (khoaHoc.trangThai !== "xuatban") {
      return <ThongBao loai="warning">Khóa học chưa mở bán.</ThongBao>;
    }

    const biTuChoi = tt?.trangThaiThanhToan === "tuChoi";
    let chuNut = mienPhi ? "Đăng ký học miễn phí" : "Mua khóa học";
    if (biTuChoi) chuNut = "Gửi lại yêu cầu thanh toán";

    return (
      <>
        {biTuChoi && (
          <ThongBao>
            Thanh toán trước đó bị từ chối (chưa nhận được tiền hoặc sai số
            tiền). Kiểm tra lại rồi gửi yêu cầu mới.
          </ThongBao>
        )}
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={xuLyMua}
          disabled={dangMua}
        >
          {dangMua ? "Đang xử lý…" : chuNut}
        </button>
        {soBaiThu > 0 && (
          <p className="muted small" style={{ textAlign: "center" }}>
            Chưa chắc? Học thử {soBaiThu} bài miễn phí bên dưới.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <section className="course-hero">
        <div className="container">
          <div className="course-layout">
            <div>
              <nav className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                <span>{layCapDo(khoaHoc.capDo).ten}</span>
              </nav>

              <h1>{khoaHoc.tieuDe}</h1>
              {khoaHoc.moTa && <p className="lead">{khoaHoc.moTa}</p>}

              <div className="course-meta">
                <span className="badge">{layCapDo(khoaHoc.capDo).ten}</span>
                <span>
                  <Icon ten="sach" size={16} /> {baiHoc.length} bài học
                </span>
                <span>
                  <Icon ten="dongHo" size={16} />{" "}
                  {dinhDangTongThoiGian(tongThoiGian)}
                </span>
                {soBaiThu > 0 && (
                  <span>
                    <Icon ten="mat" size={16} /> {soBaiThu} bài học thử
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="course-layout">
          <div className="section">
            <div className="card curriculum">
              <div className="curriculum-head">
                <h2>Nội dung khóa học</h2>
                <span className="muted small">
                  {baiHoc.length} bài · {dinhDangTongThoiGian(tongThoiGian)}
                </span>
              </div>

              {baiHoc.length === 0 ? (
                <TrongRong
                  tieuDe="Chưa có bài học"
                  moTa="Khóa học đang được biên soạn, quay lại sau nhé."
                />
              ) : (
                baiHoc.map((bai, i) => {
                  const moKhoa = bai.xemThu || duocHoc;
                  const noiDung = (
                    <>
                      <span className="lesson-num">{i + 1}</span>
                      <span className="lesson-title">{bai.tieuDe}</span>
                      {bai.xemThu && !duocHoc ? (
                        <span className="badge badge-primary">Học thử</span>
                      ) : null}
                      {bai.thoiLuong > 0 && (
                        <span className="lesson-time">
                          {dinhDangThoiLuong(bai.thoiLuong)}
                        </span>
                      )}
                      <span className="lesson-state">
                        <Icon ten={moKhoa ? "phat" : "khoa"} size={16} />
                      </span>
                    </>
                  );

                  return moKhoa ? (
                    <Link
                      key={bai.id}
                      to={`${duongDanHoc}?bai=${bai.id}`}
                      className="lesson-row"
                    >
                      {noiDung}
                    </Link>
                  ) : (
                    <div key={bai.id} className="lesson-row locked">
                      {noiDung}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <aside className="course-aside">
            <div className="card buy-card">
              <AnhBia khoaHoc={khoaHoc} />
              <div className="buy-card-body">
                <div className={`price ${mienPhi ? "price-free" : ""}`}>
                  {mienPhi ? "Miễn phí" : dinhDangTien(khoaHoc.gia)}
                </div>

                {khuVucMua()}
                {loiMua && <ThongBao>{loiMua}</ThongBao>}

                <ul className="buy-features">
                  <li>
                    <Icon ten="dung" size={16} /> {baiHoc.length} bài giảng
                    video
                  </li>
                  <li>
                    <Icon ten="dung" size={16} /> Học lại không giới hạn
                  </li>
                  <li>
                    <Icon ten="dung" size={16} /> Truy cập trên mọi thiết bị
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default ChiTietKhoaHoc;
