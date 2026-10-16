import { Link } from "react-router-dom";

function TheKhoaHoc({ khoaHoc }) {
  return (
    <article>
      <h3>{khoaHoc.tieuDe}</h3>
      <p>{khoaHoc.moTa}</p>
      <p>{Number(khoaHoc.gia).toLocaleString("vi-VN")}đ</p>
      <small>{khoaHoc.capDo}</small>
      <div>
        <Link to={`/khoahoc/${khoaHoc.id}`}>Xem chi tiết</Link>
      </div>
    </article>
  );
}

export default TheKhoaHoc;
