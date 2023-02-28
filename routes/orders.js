const express = require("express");
const { createOrder, getOrdersUser, getOrderById } = require("../controllers/orders");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", validarJWT, createOrder);

router.get("/my-orders", validarJWT, getOrdersUser);

router.get("/get", validarJWT, getOrderById);

module.exports = router;
