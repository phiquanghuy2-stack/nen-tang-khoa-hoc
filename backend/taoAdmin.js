// Nâng một tài khoản đã đăng ký thành admin
// Cách dùng: npm run tao-admin -- huy@test.com
const db = require("./config/db");

(async () => {
  const email = process.argv[2];

  if (!email) {
    console.error("Thieu email. Vi du: npm run tao-admin -- huy@test.com");
    process.exit(1);
  }

  try {
    const [kq] = await db.query(
      "UPDATE nguoidung SET vaiTro = 'admin' WHERE email = ?",
      [email],
    );

    if (kq.affectedRows === 0) {
      console.error(`Khong co tai khoan nao voi email ${email}`);
      process.exitCode = 1;
    } else {
      console.log(`Da nang ${email} thanh admin. Dang nhap lai de nhan token moi.`);
    }
  } catch (err) {
    console.error("TAO ADMIN THAT BAI:");
    console.error(err);
    process.exitCode = 1;
  }
  process.exit();
})();
