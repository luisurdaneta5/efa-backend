const express = require("express");
const { getSettings, generalSetting, rrsSetting, moneySetting, bannerSetting, getBanners, deleteBanner, textSetting } = require("../controllers/settings");
const uploadFile = require("../middlewares/uploadFile");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.get("/get", getSettings);

router.put("/general", validarJWT, generalSetting);

router.put("/rss", validarJWT, rrsSetting);

router.put("/exchange", moneySetting);

router.post("/banner/create", validarJWT, uploadFile("banner", "uploads/banners"), bannerSetting);

router.get("/banner/get", getBanners);

router.delete("/banner/delete", validarJWT, deleteBanner);

router.put("/text", validarJWT, textSetting);

module.exports = router;
