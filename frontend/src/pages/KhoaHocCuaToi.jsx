import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  TEN_TRANG_THAI_THANH_TOAN,
  MAU_TRANG_THAI_THANH_TOAN,
} from "../lib/hangSo";
import TheKhoaHoc, { TheKhoaHocCho } from "../components/TheKhoaHoc";
import Icon from "../components/Icon";
import { TrongRong, ThongBao } from "../components/TrangThai";

const CAC_TAB = [
  { ma: "", ten: "Tất cả" },
  { ma: "daThanhToan", ten: "Đang học" },
  { ma: "cho", ten: "Chờ duyệt" },
  { ma: "tuChoi", ten: "Bị từ chối" },
];

function KhoaHocCuaToi() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [tab, setTab] = useState("");

  useEffect(() => {
    api("/ghidanh/cuatoi")
      .then((ds) => setDanhSach(ds))
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, []);

  const ketQua = tab
    ? danhSach.filter((kh) => kh.trangThaiThanhToan === tab)
    : danhSach;
  const dem = (ma) =>
    danhSach.filter((kh) => kh.trangThaiThanhToan === ma).length;

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Khóa học của tôi</h1>
          <p>Tiếp tục hành trình học tập của bạn</p>
        </div>
      </div>

      {danhSach.length > 0 && (
        <div className="tabs" role="tablist">
          {CAC_TAB.map((t) => (
            <button
              key={t.ma}
              role="tab"
              aria-selected={tab === t.ma}
              className={`tab ${tab === t.ma ? "active" : ""}`}
              onClick={() => setTab(t.ma)}
            >
              {t.ten} ({t.ma ? dem(t.ma) : danhSach.length})
            </button>
          ))}
        </div>
      )}

      {loi && <ThongBao>{loi}</ThongBao>}

      {dangTai ? (
        <div className="course-grid">
          {Array.from({ length: 3 }, (_, i) => (
            <TheKhoaHocCho key={i} />
          ))}
        </div>
      ) : danhSach.length === 0 ? (
        !loi && (
          <div className="card">
            <TrongRong
              icon="sach"
              tieuDe="Bạn chưa đăng ký khóa học nào"
              moTa="Khám phá các khóa học và bắt đầu học ngay hôm nay."
            >
              <Link to="/" className="btn btn-primary">
                Xem danh sách khóa học <Icon ten="phaiTen" size={16} />
              </Link>
            </TrongRong>
          </div>
        )
      ) : ketQua.length === 0 ? (
        <div className="card">
          <TrongRong icon="luoi" tieuDe="Không có khóa nào ở mục này" />
        </div>
      ) : (
        <div className="course-grid">
          {ketQua.map((kh) => {
            const daMua = kh.trangThaiThanhToan === "daThanhToan";
            return (
              <TheKhoaHoc
                key={kh.id}
                khoaHoc={{ ...kh, id: kh.khoaHocId }}
                // Đã mua thì bấm vào là vào học luôn
                duongDan={
                  daMua
                    ? `/khoahoc/${kh.khoaHocId}/hoc`
                    : `/khoahoc/${kh.khoaHocId}`
                }
                chanTrang={
                  <div className="course-foot">
                    <span
                      className={`badge ${MAU_TRANG_THAI_THANH_TOAN[kh.trangThaiThanhToan] || ""}`}
                    >
                      {TEN_TRANG_THAI_THANH_TOAN[kh.trangThaiThanhToan] ||
                        kh.trangThaiThanhToan}
                    </span>
                    <span className="course-link">
                      {daMua ? "Vào học" : "Xem chi tiết"}{" "}
                      <Icon ten={daMua ? "phat" : "phaiTen"} size={14} />
                    </span>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default KhoaHocCuaToi;
