const fs = require("fs");
const path = require("path");
const db = require("./config/db");

const THU_MUC = path.join(__dirname, "migrations");

async function taoBangGhiNho() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations_da_chay (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tenFile VARCHAR(255) NOT NULL UNIQUE,
      ngayChay TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function layDanhSachDaChay() {
  const [rows] = await db.query("SELECT tenFile FROM migrations_da_chay");
  return rows.map((dong) => dong.tenFile);
}

function layDanhSachFile() {
  return fs
    .readdirSync(THU_MUC)
    .filter((ten) => ten.endsWith(".sql"))
    .sort();
}

function tachLenh(noiDung) {
  return noiDung
    .split(";")
    .map((lenh) => lenh.trim())
    .filter((lenh) => lenh.length > 0);
}

async function chayMotFile(tenFile) {
  const noiDung = fs.readFileSync(path.join(THU_MUC, tenFile), "utf8");

  for (const lenh of tachLenh(noiDung)) {
    await db.query(lenh);
  }

  await db.query("INSERT INTO migrations_da_chay (tenFile) VALUES (?)", [
    tenFile,
  ]);
}

(async () => {
  try {
    await taoBangGhiNho();

    const daChay = await layDanhSachDaChay();
    const canChay = layDanhSachFile().filter((ten) => !daChay.includes(ten));

    if (canChay.length === 0) {
      console.log("Khong co migration moi");
      process.exit();
    }

    for (const tenFile of canChay) {
      console.log("Dang chay:", tenFile);
      await chayMotFile(tenFile);
      console.log("  xong");
    }

    console.log(`Da chay ${canChay.length} migration`);
  } catch (err) {
    console.error("MIGRATE THAT BAI:");
    console.error(err);
    process.exitCode = 1;
  }
  process.exit();
})();
