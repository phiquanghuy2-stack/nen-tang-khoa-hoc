import Icon from "./Icon";

export function DangTai({ chu = "Đang tải…" }) {
  return (
    <div className="loading">
      <div className="spinner" />
      <span>{chu}</span>
    </div>
  );
}

export function TrongRong({ icon = "sach", tieuDe, moTa, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon ten={icon} size={26} />
      </div>
      <h3>{tieuDe}</h3>
      {moTa && <p>{moTa}</p>}
      {children}
    </div>
  );
}

export function ThongBao({ loai = "error", children }) {
  const icon = loai === "success" ? "dung" : "canhBao";
  return (
    <div className={`alert alert-${loai}`} role="alert">
      <Icon ten={icon} size={16} />
      <div>{children}</div>
    </div>
  );
}
