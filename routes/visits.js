const express = require("express");
const { setVisit, getVisits } = require("../controllers/visits");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", setVisit);

router.get("/get", validarJWT, getVisits);

module.exports = router;
