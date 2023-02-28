const express = require("express");
const { getAccounts } = require("../controllers/accounts");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.get("/getAll", validarJWT, getAccounts);

module.exports = router;
