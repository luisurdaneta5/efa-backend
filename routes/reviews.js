const express = require("express");
const { createReview, getReviews, changeStatusReviews, deleteReview } = require("../controllers/reviews");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", validarJWT, createReview);

router.get("/get", validarJWT, getReviews);

router.get("/change-status", validarJWT, changeStatusReviews);

router.delete("/delete", validarJWT, deleteReview);

module.exports = router;
