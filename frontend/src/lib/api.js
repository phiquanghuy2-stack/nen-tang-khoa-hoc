const KHOA_TOKEN = "token";

export function layToken() {
  return localStorage.getItem(KHOA_TOKEN);
}

export function luuToken(token) {
  localStorage.setItem(KHOA_TOKEN, token);
}

export function xoaToken() {
  localStorage.removeItem(KHOA_TOKEN);
}

export async function api(duongDan, tuyChon = {}) {
  const token = layToken();

  const headers = { ...tuyChon.headers };

  // FormData (upload file): để trình duyệt tự đặt Content-Type kèm boundary
  const laFormData = tuyChon.body instanceof FormData;

  if (tuyChon.body && !laFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body;
  if (laFormData) body = tuyChon.body;
  else if (tuyChon.body) body = JSON.stringify(tuyChon.body);

  const res = await fetch(`/api${duongDan}`, {
    ...tuyChon,
    headers,
    body,
  });

  // Token hỏng hoặc hết hạn — dọn sạch để app không giữ trạng thái giả
  if (res.status === 401) {
    xoaToken();
  }

  // 204 không có body để parse
  if (res.status === 204) {
    return null;
  }

  const duLieu = await res.json().catch(() => null);

  if (!res.ok) {
    const loi = new Error(duLieu?.message || "Có lỗi xảy ra");
    loi.status = res.status;
    throw loi;
  }

  return duLieu;
}
