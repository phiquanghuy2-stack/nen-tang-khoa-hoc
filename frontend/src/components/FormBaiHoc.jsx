import { useState } from "react";
import { ThongBao } from "./TrangThai";

const MAC_DINH = {
  tieuDe: "",
  noiDung: "",
  videoUrl: "",
  thoiLuong: 0,
  thuTu: "",
  xemThu: false,
};

function taoForm(giaTri) {
  const form = Object.fromEntries(
    Object.keys(MAC_DINH).map((k) => [k, giaTri?.[k] ?? MAC_DINH[k]]),
  );
  form.xemThu = !!form.xemThu; // MySQL trả 0/1
  return form;
}

function FormBaiHoc({ giaTriBanDau, onLuu, onHuy, chuNut = "Lưu" }) {
  const [form, setForm] = useState(() => taoForm(giaTriBanDau));
  const [loi, setLoi] = useState(null);
  const [dangGui, setDangGui] = useState(false);

  function doi(e) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function xuLyGui(e) {
    e.preventDefault();
    setLoi(null);
    setDangGui(true);
    try {
      await onLuu({
        tieuDe: form.tieuDe,
        noiDung: form.noiDung || null,
        videoUrl: form.videoUrl || null,
        thoiLuong: Number(form.thoiLuong) || 0,
        // Để trống thì backend tự xếp cuối
        thuTu: form.thuTu === "" ? undefined : Number(form.thuTu),
        xemThu: form.xemThu,
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
        <label htmlFor="bh-tieuDe" className="field-label">
          Tiêu đề
        </label>
        <input
          id="bh-tieuDe"
          name="tieuDe"
          className="input"
          placeholder="vd: Bài 1: Giới thiệu"
          value={form.tieuDe}
          onChange={doi}
          required
        />
      </div>

      <div className="field span-2">
        <label htmlFor="bh-videoUrl" className="field-label">
          Link video
        </label>
        <input
          id="bh-videoUrl"
          name="videoUrl"
          type="url"
          className="input"
          placeholder="https://youtu.be/…"
          value={form.videoUrl}
          onChange={doi}
        />
        <span className="field-hint">
          Link YouTube sẽ được nhúng thẳng vào trang học
        </span>
      </div>

      <div className="field span-2">
        <label htmlFor="bh-noiDung" className="field-label">
          Nội dung
        </label>
        <textarea
          id="bh-noiDung"
          name="noiDung"
          className="input"
          rows={6}
          placeholder="Ghi chú, lý thuyết, bài tập…"
          value={form.noiDung}
          onChange={doi}
        />
      </div>

      <div className="field">
        <label htmlFor="bh-thoiLuong" className="field-label">
          Thời lượng (giây)
        </label>
        <input
          id="bh-thoiLuong"
          name="thoiLuong"
          type="number"
          min="0"
          className="input"
          value={form.thoiLuong}
          onChange={doi}
        />
      </div>

      <div className="field">
        <label htmlFor="bh-thuTu" className="field-label">
          Thứ tự
        </label>
        <input
          id="bh-thuTu"
          name="thuTu"
          type="number"
          min="1"
          className="input"
          placeholder="Tự động xếp cuối"
          value={form.thuTu}
          onChange={doi}
        />
      </div>

      <div className="span-2">
        <label className="checkbox">
          <input
            name="xemThu"
            type="checkbox"
            checked={form.xemThu}
            onChange={doi}
          />
          Cho học thử miễn phí (ai cũng xem được bài này)
        </label>
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
        <button type="submit" className="btn btn-primary" disabled={dangGui}>
          {dangGui ? "Đang lưu…" : chuNut}
        </button>
      </div>
    </form>
  );
}

export default FormBaiHoc;
