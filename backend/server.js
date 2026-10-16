require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/khoahoc", require("./routes/khoaHocRoutes"));
app.use("/api/baihoc", require("./routes/baiHocRoutes").routerPhang); // THÊM

app.get("/api/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT VERSION() AS phienBan");
    res.json({ message: "Backend sống", mysql: rows[0].phienBan });
  } catch (err) {
    console.error("LỖI:", err.message);
    res.status(500).json({ message: "Không nối được database" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server chạy tại cổng " + PORT));
