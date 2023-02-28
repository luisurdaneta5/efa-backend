const express = require("express");
const { validarJWT } = require("../middlewares/validarJWT");
const uploadFile = require("../middlewares/uploadFile");
const { createRefill } = require("../controllers/refills");

const router = express.Router();

router.post("/create", validarJWT, uploadFile("voucher", "uploads/vouchers"), createRefill);
module.exports = router;
