const express = require("express");
const controller = require("../controllers/baiHocController");

// Router LỒNG — sẽ gắn vào /api/khoahoc/:khoaHocId/baihoc
// mergeParams: true BẮT BUỘC, thiếu nó thì req.params.khoaHocId là undefined
const routerLong = express.Router({ mergeParams: true });

routerLong.get("/", controller.layTheoKhoaHoc);
routerLong.post("/", controller.them);

// Router PHẲNG — sẽ gắn vào /api/baihoc
const routerPhang = express.Router();

routerPhang.get("/:id", controller.layTheoId);
routerPhang.put("/:id", controller.sua);
routerPhang.delete("/:id", controller.xoa);

module.exports = { routerLong, routerPhang };
