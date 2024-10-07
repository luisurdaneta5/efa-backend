const express = require("express");
const { getAccounts, addAccount } = require("../controllers/accounts");
const { validarJWT } = require("../middlewares/validarJWT");
const uploadFile = require("../middlewares/uploadFile");

const router = express.Router();

router.get("/getAll", getAccounts);
router.post("/add", validarJWT, uploadFile("img", "uploads/banks"), addAccount);

module.exports = router;
