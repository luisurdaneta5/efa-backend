const express = require("express");
const { getSettings, generalSetting, rrsSetting, moneySetting, bannerSetting, getBanners, deleteBanner, textSetting } = require("../controllers/settings");
const uploadFile = require("../middlewares/uploadFile");

const router = express.Router();

router.get("/get", getSettings);

router.put("/general", generalSetting);

router.put("/rss", rrsSetting);

router.put("/exchange", moneySetting);

router.post("/banner/create", uploadFile("banner", "uploads/banners"), bannerSetting);

router.get("/banner/get", getBanners);

router.delete("/banner/delete", deleteBanner);

router.put("/text", textSetting);

module.exports = router;
