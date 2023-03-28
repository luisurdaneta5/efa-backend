const express = require("express");
const { getSalesToday, getProductsSales, getSalesMonth, getSalesWeek, getChartSales } = require("../controllers/sales");

const router = express.Router();

router.get("/today", getSalesToday);

router.get("/month", getSalesMonth);

router.get("/week", getSalesWeek);

router.get("/items", getProductsSales);

router.get("/data-chart", getChartSales);

module.exports = router;
