const express = require("express");
const { setVisit, getVisits, sendEmail } = require("../controllers/visits");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", setVisit);

router.get("/get", validarJWT, getVisits);

router.post("/sendemail", sendEmail);

module.exports = router;
