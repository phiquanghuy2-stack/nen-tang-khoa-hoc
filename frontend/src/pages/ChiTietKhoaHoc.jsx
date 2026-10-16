import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function dinhDangThoiLuong(giay) {
  if (!giay) return null;
  const phut = Math.floor(giay / 60);
  const du = giay % 60;
  return `${phut}:${String(du).padStart(2, "0")}`;
}

function ChiTietKhoaHoc() {
  const { id } = useParams();

  const [khoaHoc, setKhoaHoc] = useState(null);
  const [baiHoc, setBaiHoc] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDangTai(true);
    setLoi(null);

    Promise.all([
      fetch(`/api/khoahoc/${id}`).then((res) => {
        if (res.status === 404) throw new Error("Không tìm thấy khóa học");
        if (!res.ok) throw new Error("Không tải được khóa học");
        return res.json();
      }),
      fetch(`/api/khoahoc/${id}/baihoc`).then((res) => {
        if (!res.ok) throw new Error("Không tải được danh sách bài");
        return res.json();
      }),
    ])
      .then(([kh, ds]) => {
        setKhoaHoc(kh);
        setBaiHoc(ds);
      })
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [id]);

  if (dangTai) return <p>Đang tải…</p>;

  if (loi) {
    return (
      <div>
        <p>{loi}</p>
        <Link to="/">← Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">← Về trang chủ</Link>

      <h1>{khoaHoc.tieuDe}</h1>
      <p>
        <small>{khoaHoc.capDo}</small>
      </p>
      <p>{khoaHoc.moTa}</p>
      <p>
        <strong>{Number(khoaHoc.gia).toLocaleString("vi-VN")}đ</strong>
      </p>

      <button disabled>Mua khóa học (mốc 7)</button>

      <h2>Nội dung khóa học — {baiHoc.length} bài</h2>

      {baiHoc.length === 0 ? (
        <p>Khóa học chưa có bài nào</p>
      ) : (
        <ol>
          {baiHoc.map((bai) => (
            <li key={bai.id}>
              {bai.tieuDe}
              {bai.thoiLuong > 0 && (
                <span> · {dinhDangThoiLuong(bai.thoiLuong)}</span>
              )}
              {bai.xemThu ? <span> · Học thử</span> : <span> · 🔒</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default ChiTietKhoaHoc;
