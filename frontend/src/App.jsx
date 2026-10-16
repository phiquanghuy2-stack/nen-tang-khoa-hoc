import { Routes, Route } from "react-router-dom";
import ThanhDieuHuong from "./components/ThanhDieuHuong";
import TrangChu from "./pages/TrangChu";
import ChiTietKhoaHoc from "./pages/ChiTietKhoaHoc";

function App() {
  return (
    <div>
      <ThanhDieuHuong />

      <main>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/khoahoc/:id" element={<ChiTietKhoaHoc />} />
          <Route path="*" element={<p>Không tìm thấy trang</p>} />
        </Routes>
      </main>

      <footer>
        <small>EduPractice — {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;
