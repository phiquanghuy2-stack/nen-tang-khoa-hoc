const express = require("express");
const controller = require("../controllers/baiHocController");
const xacThuc = require("../middleware/xacThuc"); // THÊM
const chiAdmin = require("../middleware/chiAdmin"); // THÊM
const xacThucTuyChon = require("../middleware/xacThucTuyChon"); // THÊM

const routerLong = express.Router({ mergeParams: true });
routerLong.get("/", controller.layTheoKhoaHoc);
routerLong.post("/", xacThuc, chiAdmin, controller.them); // SỬA

const routerPhang = express.Router();
routerPhang.get("/:id", xacThucTuyChon, controller.layTheoId); // SỬA
routerPhang.put("/:id", xacThuc, chiAdmin, controller.sua); // SỬA
routerPhang.delete("/:id", xacThuc, chiAdmin, controller.xoa); // SỬA

module.exports = { routerLong, routerPhang };
