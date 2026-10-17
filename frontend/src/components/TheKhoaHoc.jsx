import { Link } from "react-router-dom";
import { dinhDangTien } from "../lib/hangSo";
import AnhBia from "./AnhBia";
import Icon from "./Icon";

function TheKhoaHoc({ khoaHoc, chanTrang, duongDan }) {
  const mienPhi = Number(khoaHoc.gia) === 0;

  return (
    <Link to={duongDan || `/khoahoc/${khoaHoc.id}`} className="course-card">
      <AnhBia khoaHoc={khoaHoc} hienCapDo />
      <div className="course-body">
        <h3>{khoaHoc.tieuDe}</h3>
        {khoaHoc.moTa && <p>{khoaHoc.moTa}</p>}
      </div>
      {chanTrang || (
        <div className="course-foot">
          <span className={`price ${mienPhi ? "price-free" : ""}`}>
            {mienPhi ? "Miễn phí" : dinhDangTien(khoaHoc.gia)}
          </span>
          <span className="course-link">
            Xem chi tiết <Icon ten="phaiTen" size={14} />
          </span>
        </div>
      )}
    </Link>
  );
}

export function TheKhoaHocCho() {
  return (
    <div className="course-card skeleton-card" aria-hidden="true">
      <div className="cover skeleton" style={{ borderRadius: 0 }} />
      <div className="course-body">
        <div className="skeleton" style={{ height: 18, width: "85%" }} />
        <div className="skeleton" style={{ height: 14, width: "100%" }} />
        <div className="skeleton" style={{ height: 14, width: "60%" }} />
      </div>
      <div className="course-foot">
        <div className="skeleton" style={{ height: 22, width: 90 }} />
      </div>
    </div>
  );
}

export default TheKhoaHoc;
