const db = require("./config/db");

const KHOA_HOC = [
  {
    tieuDe: "Toán 12 — Ôn thi THPT",
    moTa: "Hệ thống kiến thức toán lớp 12",
    gia: 499000,
    capDo: "lop12",
  },
  {
    tieuDe: "Vật lý 11 — Nền tảng",
    moTa: "Điện học và từ trường",
    gia: 399000,
    capDo: "lop11",
  },
  {
    tieuDe: "Hóa học 10 — Căn bản",
    moTa: "Cấu tạo nguyên tử, bảng tuần hoàn",
    gia: 349000,
    capDo: "lop10",
  },
  {
    tieuDe: "TOEIC 500+ cấp tốc",
    moTa: "Luyện nghe đọc theo dạng đề",
    gia: 799000,
    capDo: "toeic",
  },
  {
    tieuDe: "IELTS Writing 6.5",
    moTa: "Task 1 và Task 2 có chữa bài",
    gia: 1290000,
    capDo: "ielts",
  },
  {
    tieuDe: "Tư duy phản biện",
    moTa: "Nhận diện ngụy biện, lập luận chặt",
    gia: 299000,
    capDo: "tuduy",
  },
  {
    tieuDe: "Giải tích 1",
    moTa: "Giới hạn, đạo hàm, tích phân",
    gia: 555000,
    capDo: "sinhvien",
  },
];

const BAI_HOC = [
  {
    tieuDe: "Bài 1: Giới thiệu khóa học",
    thoiLuong: 420,
    xemThu: true,
    videoUrl: "https://youtu.be/aaa",
  },
  {
    tieuDe: "Bài 2: Kiến thức nền",
    thoiLuong: 1500,
    xemThu: false,
    videoUrl: "https://youtu.be/bbb",
  },
  {
    tieuDe: "Bài 3: Bài tập vận dụng",
    thoiLuong: 1800,
    xemThu: false,
    videoUrl: "https://youtu.be/ccc",
  },
];

(async () => {
  try {
    // Xóa khóa học là ON DELETE CASCADE cuốn theo toàn bộ baihoc
    await db.query("DELETE FROM khoahoc");
    await db.query("ALTER TABLE khoahoc AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE baihoc AUTO_INCREMENT = 1");

    for (const kh of KHOA_HOC) {
      const [kq] = await db.query(
        `INSERT INTO khoahoc (tieuDe, moTa, gia, capDo, trangThai)
         VALUES (?, ?, ?, ?, 'xuatban')`,
        [kh.tieuDe, kh.moTa, kh.gia, kh.capDo],
      );

      let thuTu = 1;
      for (const bai of BAI_HOC) {
        await db.query(
          `INSERT INTO baihoc (khoaHocId, tieuDe, noiDung, videoUrl, thuTu, thoiLuong, xemThu)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            kq.insertId,
            bai.tieuDe,
            "Nội dung bài viết...",
            bai.videoUrl,
            thuTu++,
            bai.thoiLuong,
            bai.xemThu,
          ],
        );
      }
    }

    console.log(
      `Da chen ${KHOA_HOC.length} khoa hoc, moi khoa ${BAI_HOC.length} bai`,
    );
  } catch (err) {
    console.error("SEED THAT BAI:");
    console.error(err);
    process.exitCode = 1;
  }
  process.exit();
})();
