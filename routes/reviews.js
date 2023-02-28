const express = require("express");
const { createReview } = require("../controllers/reviews");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", validarJWT, createReview);
module.exports = router;
