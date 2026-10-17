import { layCapDo } from "../lib/hangSo";

// Ảnh bìa khóa học. Chưa có ảnh thì vẽ nền gradient theo cấp độ.
function AnhBia({ khoaHoc, hienCapDo = false }) {
  const capDo = layCapDo(khoaHoc.capDo);

  return (
    <div className="cover">
      {khoaHoc.anhBia ? (
        <img src={khoaHoc.anhBia} alt={khoaHoc.tieuDe} loading="lazy" />
      ) : (
        <div
          className="cover-placeholder"
          style={{
            background: `linear-gradient(135deg, ${capDo.mau[0]}, ${capDo.mau[1]})`,
          }}
        >
          <span>{capDo.ngan}</span>
        </div>
      )}
      {hienCapDo && <span className="badge">{capDo.ten}</span>}
    </div>
  );
}

export default AnhBia;
