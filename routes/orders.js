const express = require("express");
const {
	createOrder,
	getOrdersUser,
	getOrderById,
	getOrders,
	getOrdersPending,
	getOrderByIdAdmin,
	getOrdersComplete,
	changeStatusOrder,
	getOrdersForDashboard,
} = require("../controllers/orders");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", validarJWT, createOrder);

router.get("/my-orders", validarJWT, getOrdersUser);

router.get("/get", validarJWT, getOrderById);

router.get("/get/all", getOrders);

router.get("/pending", getOrdersPending);

router.get("/complete", getOrdersComplete);

router.put("/change-status", changeStatusOrder);

router.get("/get/dashboard", getOrdersForDashboard);

module.exports = router;
