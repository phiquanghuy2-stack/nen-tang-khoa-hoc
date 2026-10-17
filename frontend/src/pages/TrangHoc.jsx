import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { dinhDangThoiLuong } from "../lib/hangSo";
import TrinhPhatVideo from "../components/TrinhPhatVideo";
import Icon from "../components/Icon";
import { DangTai, TrongRong } from "../components/TrangThai";

function TrangHoc() {
  const { id } = useParams();
  const { laAdmin } = useAuth();
  // Bài đang xem nằm trên URL (?bai=5) để F5 hay gửi link vẫn đúng bài
  const [thamSo, setThamSo] = useSearchParams();

  const [khoaHoc, setKhoaHoc] = useState(null);
  const [danhSach, setDanhSach] = useState([]);
  const [duocHoc, setDuocHoc] = useState(false);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

  // { id, bai, loi } — kết quả tải của bài gần nhất
  const [ketQuaBai, setKetQuaBai] = useState(null);

  useEffect(() => {
    Promise.all([
      api(`/khoahoc/${id}`),
      api(`/khoahoc/${id}/baihoc`),
      api(`/ghidanh/trangthai/${id}`).catch(() => null),
    ])
      .then(([kh, ds, tt]) => {
        setKhoaHoc(kh);
        setDanhSach(ds);
        setDuocHoc(laAdmin || !!tt?.duocHoc);
        setLoi(null);
      })
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [id, laAdmin]);

  const coTheMo = (b) => !!b && (!!b.xemThu || duocHoc);

  // Không chỉ định bài thì mở bài đầu tiên được phép xem
  const baiChon =
    Number(thamSo.get("bai")) ||
    (danhSach.find(coTheMo) || danhSach[0])?.id ||
    null;

  useEffect(() => {
    if (!baiChon) return;
    api(`/baihoc/${baiChon}`)
      .then((bai) => setKetQuaBai({ id: baiChon, bai, loi: null }))
      .catch((err) =>
        setKetQuaBai({ id: baiChon, bai: null, loi: err.message }),
      );
  }, [baiChon]);

  function chonBai(baiHocId) {
    setThamSo({ bai: baiHocId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (dangTai) return <DangTai />;

  if (loi) {
    return (
      <div className="container">
        <TrongRong icon="canhBao" tieuDe={loi}>
          <Link to={`/khoahoc/${id}`} className="btn btn-secondary">
            <Icon ten="traiTen" size={16} /> Về trang khóa học
          </Link>
        </TrongRong>
      </div>
    );
  }

  if (danhSach.length === 0) {
    return (
      <div className="container">
        <TrongRong
          tieuDe="Khóa học chưa có bài nào"
          moTa="Bài giảng đang được biên soạn, quay lại sau nhé."
        >
          <Link to={`/khoahoc/${id}`} className="btn btn-secondary">
            <Icon ten="traiTen" size={16} /> Về trang khóa học
          </Link>
        </TrongRong>
      </div>
    );
  }

  const dangTaiBai = ketQuaBai?.id !== baiChon;
  const baiDangXem = dangTaiBai ? null : ketQuaBai.bai;
  const loiBai = dangTaiBai ? null : ketQuaBai.loi;

  const viTri = danhSach.findIndex((b) => b.id === baiChon);
  const baiTruoc = danhSach[viTri - 1];
  const baiSau = danhSach[viTri + 1];
  const baiTomTat = danhSach[viTri];

  return (
    <div className="container">
      <div className="lesson-layout">
        <div>
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to={`/khoahoc/${id}`}>
              <Icon ten="traiTen" size={14} /> {khoaHoc.tieuDe}
            </Link>
          </nav>

          {dangTaiBai ? (
            <div className="player skeleton" />
          ) : loiBai ? (
            <div className="player">
              <div className="player-fallback">
                <div style={{ textAlign: "center", color: "#fff" }}>
                  <Icon ten="khoa" size={36} strokeWidth={1.5} />
                  <p style={{ margin: "12px 0 16px" }}>{loiBai}</p>
                  <Link to={`/khoahoc/${id}`} className="btn btn-primary">
                    Mua khóa học để mở khóa
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <TrinhPhatVideo url={baiDangXem.videoUrl} />
          )}

          <div className="row" style={{ marginTop: 24 }}>
            {viTri >= 0 && (
              <span className="badge">
                Bài {viTri + 1}/{danhSach.length}
              </span>
            )}
            {!!baiTomTat?.xemThu && (
              <span className="badge badge-primary">Học thử</span>
            )}
            {baiTomTat?.thoiLuong > 0 && (
              <span className="badge">
                <Icon ten="dongHo" size={12} />
                {dinhDangThoiLuong(baiTomTat.thoiLuong)}
              </span>
            )}
          </div>

          <h1 className="lesson-heading">{baiTomTat?.tieuDe}</h1>

          {baiDangXem &&
            (baiDangXem.noiDung ? (
              <div className="lesson-content">{baiDangXem.noiDung}</div>
            ) : (
              <p className="muted">Bài này chưa có nội dung chữ.</p>
            ))}

          <div className="lesson-nav">
            {baiTruoc ? (
              <button
                className="btn btn-secondary"
                onClick={() => chonBai(baiTruoc.id)}
              >
                <Icon ten="traiTen" size={16} /> Bài trước
              </button>
            ) : (
              <span />
            )}
            {baiSau && (
              <button
                className="btn btn-primary"
                onClick={() => chonBai(baiSau.id)}
              >
                {coTheMo(baiSau) ? "Bài tiếp theo" : "Bài tiếp theo (đã khóa)"}
                <Icon ten={coTheMo(baiSau) ? "phaiTen" : "khoa"} size={16} />
              </button>
            )}
          </div>
        </div>

        <aside className="card lesson-side">
          <div className="lesson-side-head">
            <h3>Danh sách bài</h3>
            <span className="muted small">{danhSach.length} bài học</span>
          </div>
          <div className="lesson-side-list">
            {danhSach.map((bai, i) => {
              const moKhoa = coTheMo(bai);
              const laBaiNay = bai.id === baiChon;
              return (
                <button
                  key={bai.id}
                  type="button"
                  onClick={() => chonBai(bai.id)}
                  className={`lesson-row lesson-row-btn ${laBaiNay ? "current" : ""} ${moKhoa ? "" : "locked"}`}
                >
                  <span className="lesson-num">{i + 1}</span>
                  <span className="lesson-title">{bai.tieuDe}</span>
                  {bai.thoiLuong > 0 && (
                    <span className="lesson-time">
                      {dinhDangThoiLuong(bai.thoiLuong)}
                    </span>
                  )}
                  <span className="lesson-state">
                    <Icon ten={moKhoa ? "phat" : "khoa"} size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default TrangHoc;
