import { useState, useEffect } from "react";
import TheKhoaHoc from "../components/TheKhoaHoc";

const DANH_SACH_CAP_DO = [
  { ma: "", ten: "Tất cả" },
  { ma: "lop10", ten: "Lớp 10" },
  { ma: "lop11", ten: "Lớp 11" },
  { ma: "lop12", ten: "Lớp 12" },
  { ma: "sinhvien", ten: "Sinh viên" },
  { ma: "toeic", ten: "TOEIC" },
  { ma: "ielts", ten: "IELTS" },
  { ma: "tuduy", ten: "Tư duy" },
];

function TrangChu() {
  const [khoaHoc, setKhoaHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const [capDo, setCapDo] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDangTai(true);
    setLoi(null);

    const duongDan = capDo
      ? `/api/khoahoc?capDo=${encodeURIComponent(capDo)}`
      : "/api/khoahoc";

    fetch(duongDan)
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được danh sách");
        return res.json();
      })
      .then((ds) => setKhoaHoc(ds))
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [capDo]);

  return (
    <div>
      <h1>Khóa học</h1>

      <nav>
        {DANH_SACH_CAP_DO.map((muc) => (
          <button
            key={muc.ma}
            onClick={() => setCapDo(muc.ma)}
            disabled={capDo === muc.ma}
          >
            {muc.ten}
          </button>
        ))}
      </nav>

      {dangTai && <p>Đang tải…</p>}
      {!dangTai && loi && <p>{loi}</p>}
      {!dangTai && !loi && khoaHoc.length === 0 && <p>Chưa có khóa học nào</p>}
      {!dangTai &&
        !loi &&
        khoaHoc.map((kh) => <TheKhoaHoc key={kh.id} khoaHoc={kh} />)}
    </div>
  );
}

export default TrangChu;
