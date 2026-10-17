import { useState } from "react";
import { api } from "../lib/api";
import { DANH_SACH_CAP_DO, TEN_TRANG_THAI_KHOA_HOC } from "../lib/hangSo";
import Icon from "./Icon";
import { ThongBao } from "./TrangThai";

const MAC_DINH = {
  tieuDe: "",
  moTa: "",
  gia: 0,
  capDo: DANH_SACH_CAP_DO[0].ma,
  trangThai: "nhap",
  anhBia: "",
};

// Lấy đúng các trường của form, đổi null từ database thành "" cho input
function taoForm(giaTri) {
  return Object.fromEntries(
    Object.keys(MAC_DINH).map((k) => [k, giaTri?.[k] ?? MAC_DINH[k]]),
  );
}

function FormKhoaHoc({ giaTriBanDau, onLuu, onHuy, chuNut = "Lưu" }) {
  const [form, setForm] = useState(() => taoForm(giaTriBanDau));
  const [loi, setLoi] = useState(null);
  const [dangGui, setDangGui] = useState(false);
  const [dangTaiAnh, setDangTaiAnh] = useState(false);

  function doi(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function xuLyChonAnh(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoi(null);
    setDangTaiAnh(true);
    try {
      const duLieu = new FormData();
      duLieu.append("anh", file);
      const kq = await api("/upload", { method: "POST", body: duLieu });
      setForm((f) => ({ ...f, anhBia: kq.url }));
    } catch (err) {
      setLoi(err.message);
    } finally {
      setDangTaiAnh(false);
      e.target.value = "";
    }
  }

  async function xuLyGui(e) {
    e.preventDefault();
    setLoi(null);
    setDangGui(true);
    try {
      await onLuu({
        ...form,
        gia: Number(form.gia) || 0,
        moTa: form.moTa || null,
        anhBia: form.anhBia || null,
      });
    } catch (err) {
      setLoi(err.message);
    } finally {
      setDangGui(false);
    }
  }

  return (
    <form onSubmit={xuLyGui} className="form-grid">
      <div className="field span-2">
        <label htmlFor="kh-tieuDe" className="field-label">
          Tiêu đề
        </label>
        <input
          id="kh-tieuDe"
          name="tieuDe"
          className="input"
          placeholder="vd: Toán 12 — Ôn thi THPT"
          value={form.tieuDe}
          onChange={doi}
          required
        />
      </div>

      <div className="field span-2">
        <label htmlFor="kh-moTa" className="field-label">
          Mô tả
        </label>
        <textarea
          id="kh-moTa"
          name="moTa"
          className="input"
          rows={3}
          placeholder="Khóa học này giúp học viên…"
          value={form.moTa}
          onChange={doi}
        />
      </div>

      <div className="field">
        <label htmlFor="kh-gia" className="field-label">
          Giá (đồng)
        </label>
        <input
          id="kh-gia"
          name="gia"
          type="number"
          min="0"
          step="1000"
          className="input"
          value={form.gia}
          onChange={doi}
        />
        <span className="field-hint">Để 0 nếu khóa miễn phí</span>
      </div>

      <div className="field">
        <label htmlFor="kh-capDo" className="field-label">
          Cấp độ
        </label>
        <select
          id="kh-capDo"
          name="capDo"
          className="input"
          value={form.capDo}
          onChange={doi}
        >
          {DANH_SACH_CAP_DO.map((c) => (
            <option key={c.ma} value={c.ma}>
              {c.ten}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="kh-trangThai" className="field-label">
          Trạng thái
        </label>
        <select
          id="kh-trangThai"
          name="trangThai"
          className="input"
          value={form.trangThai}
          onChange={doi}
        >
          {Object.entries(TEN_TRANG_THAI_KHOA_HOC).map(([ma, ten]) => (
            <option key={ma} value={ma}>
              {ten}
            </option>
          ))}
        </select>
        <span className="field-hint">
          Bản nháp không hiện với học viên
        </span>
      </div>

      <div className="field span-2">
        <span className="field-label">Ảnh bìa</span>
        <div className="upload-box">
          <div className="upload-preview">
            {form.anhBia ? (
              <img src={form.anhBia} alt="Ảnh bìa" />
            ) : (
              <Icon ten="anh" size={28} strokeWidth={1.5} />
            )}
          </div>
          <div className="upload-actions">
            <div className="row">
              <label
                className="btn btn-secondary btn-sm"
                aria-disabled={dangTaiAnh}
              >
                <Icon ten="taiLen" size={14} />
                {dangTaiAnh
                  ? "Đang tải lên…"
                  : form.anhBia
                    ? "Đổi ảnh"
                    : "Tải ảnh lên"}
                <input
                  type="file"
                  className="file-input"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={xuLyChonAnh}
                  disabled={dangTaiAnh}
                />
              </label>
              {form.anhBia && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setForm({ ...form, anhBia: "" })}
                >
                  Bỏ ảnh
                </button>
              )}
            </div>
            <span className="field-hint">
              JPG, PNG, WEBP hoặc GIF · tối đa 2MB · tỉ lệ 16:9 đẹp nhất
            </span>
          </div>
        </div>
      </div>

      {loi && (
        <div className="span-2">
          <ThongBao>{loi}</ThongBao>
        </div>
      )}

      <div className="form-actions span-2">
        {onHuy && (
          <button type="button" className="btn btn-ghost" onClick={onHuy}>
            Hủy
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={dangGui || dangTaiAnh}
        >
          {dangGui ? "Đang lưu…" : chuNut}
        </button>
      </div>
    </form>
  );
}

export default FormKhoaHoc;
