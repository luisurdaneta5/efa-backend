const express = require("express");
const { validarJWT } = require("../middlewares/validarJWT");
const uploadFile = require("../middlewares/uploadFile");
const { createRefill, getRefills, getExchangeById, setChangeStatusExchange, getRefillsHistory } = require("../controllers/refills");

const router = express.Router();

router.post("/create", validarJWT, uploadFile("voucher", "uploads/vouchers"), createRefill);
router.get("/get", validarJWT, getRefills);
router.get("/get/:id", validarJWT, getExchangeById);
router.put("/set-status", validarJWT, setChangeStatusExchange);
router.get("/get-history", validarJWT, getRefillsHistory);

module.exports = router;
