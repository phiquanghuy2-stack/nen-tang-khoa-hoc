import { useState, useEffect } from "react";
import TheKhoaHoc, { TheKhoaHocCho } from "../components/TheKhoaHoc";
import Icon from "../components/Icon";
import { TrongRong, ThongBao } from "../components/TrangThai";
import { api } from "../lib/api";
import { DANH_SACH_CAP_DO as CAC_CAP_DO } from "../lib/hangSo";

const DANH_SACH_CAP_DO = [{ ma: "", ten: "Tất cả" }, ...CAC_CAP_DO];

// Bỏ dấu để tìm "toan" vẫn ra "Toán"
function boDau(chu) {
  return chu
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function TrangChu() {
  const [khoaHoc, setKhoaHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [capDo, setCapDo] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDangTai(true);
    setLoi(null);

    const duongDan = capDo
      ? `/khoahoc?capDo=${encodeURIComponent(capDo)}`
      : "/khoahoc";

    api(duongDan)
      .then(setKhoaHoc)
      .catch(() => setLoi("Không tải được danh sách khóa học"))
      .finally(() => setDangTai(false));
  }, [capDo]);

  const tuKhoaChuan = boDau(tuKhoa.trim());
  const ketQua = tuKhoaChuan
    ? khoaHoc.filter((kh) =>
        boDau(`${kh.tieuDe} ${kh.moTa || ""}`).includes(tuKhoaChuan),
      )
    : khoaHoc;

  const tenCapDo = DANH_SACH_CAP_DO.find((c) => c.ma === capDo)?.ten;

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow">
            <Icon ten="ngoiSao" size={14} /> Nền tảng học online cho học sinh
            &amp; sinh viên
          </span>
          <h1>
            Học chắc kiến thức,{" "}
            <span className="gradient-text">tự tin bứt phá</span>
          </h1>
          <p className="hero-sub">
            Khóa học từ lớp 10 đến đại học, luyện thi TOEIC, IELTS — bài giảng
            video ngắn gọn, học thử miễn phí trước khi mua.
          </p>

          <div className="hero-search input-icon-wrap">
            <Icon ten="timKiem" size={18} />
            <input
              className="input"
              type="search"
              placeholder="Tìm khóa học, ví dụ: Toán 12, TOEIC…"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              aria-label="Tìm khóa học"
            />
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{CAC_CAP_DO.length}</strong>
              <span>Cấp độ học</span>
            </div>
            <div className="hero-stat">
              <strong>Video</strong>
              <span>Bài giảng xem lại không giới hạn</span>
            </div>
            <div className="hero-stat">
              <strong>Học thử</strong>
              <span>Miễn phí bài đầu mỗi khóa</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="chips" role="tablist" aria-label="Lọc theo cấp độ">
          {DANH_SACH_CAP_DO.map((muc) => (
            <button
              key={muc.ma}
              role="tab"
              aria-selected={capDo === muc.ma}
              className={`chip ${capDo === muc.ma ? "active" : ""}`}
              onClick={() => setCapDo(muc.ma)}
            >
              {muc.ten}
            </button>
          ))}
        </div>

        <div className="list-head">
          <h2>{capDo ? `Khóa học ${tenCapDo}` : "Tất cả khóa học"}</h2>
          {!dangTai && !loi && (
            <span className="muted small">{ketQua.length} khóa học</span>
          )}
        </div>

        {loi && <ThongBao>{loi}</ThongBao>}

        {dangTai ? (
          <div className="course-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <TheKhoaHocCho key={i} />
            ))}
          </div>
        ) : (
          !loi &&
          (ketQua.length === 0 ? (
            <div className="card">
              <TrongRong
                icon="timKiem"
                tieuDe="Không có khóa học phù hợp"
                moTa={
                  tuKhoa
                    ? `Không tìm thấy khóa nào khớp với “${tuKhoa}”.`
                    : "Cấp độ này chưa có khóa học nào. Quay lại sau nhé!"
                }
              />
            </div>
          ) : (
            <div className="course-grid">
              {ketQua.map((kh) => (
                <TheKhoaHoc key={kh.id} khoaHoc={kh} />
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default TrangChu;
