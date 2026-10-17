import { createContext, useContext, useState, useEffect } from "react";
import { api, layToken, luuToken, xoaToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null);
  // Không có token thì khỏi cần kiểm tra gì
  const [dangKiemTra, setDangKiemTra] = useState(() => !!layToken());

  // Chạy 1 lần khi app mở: có token cũ thì hỏi backend xem còn dùng được không
  useEffect(() => {
    if (!layToken()) return;

    api("/auth/toi")
      .then((nd) => setNguoiDung(nd))
      .catch(() => {
        xoaToken();
        setNguoiDung(null);
      })
      .finally(() => setDangKiemTra(false));
  }, []);

  async function dangNhap(email, matKhau) {
    const kq = await api("/auth/dangnhap", {
      method: "POST",
      body: { email, matKhau },
    });
    luuToken(kq.token);
    setNguoiDung(kq.nguoiDung);
    return kq.nguoiDung;
  }

  async function dangKy(tenDangNhap, email, matKhau) {
    const kq = await api("/auth/dangky", {
      method: "POST",
      body: { tenDangNhap, email, matKhau },
    });
    luuToken(kq.token);
    setNguoiDung(kq.nguoiDung);
    return kq.nguoiDung;
  }

  function dangXuat() {
    xoaToken();
    setNguoiDung(null);
  }

  const giaTri = {
    nguoiDung,
    dangKiemTra,
    daDangNhap: nguoiDung !== null,
    laAdmin: nguoiDung?.vaiTro === "admin",
    dangNhap,
    dangKy,
    dangXuat,
  };

  return <AuthContext.Provider value={giaTri}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phải dùng bên trong <AuthProvider>");
  }
  return ctx;
}
