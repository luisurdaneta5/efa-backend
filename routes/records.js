const express = require("express");
const { setRecord, getRecord } = require("../controllers/records");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.put("/set", validarJWT, setRecord);

router.get("/get", getRecord);

module.exports = router;
