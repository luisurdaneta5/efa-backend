const express = require("express");
const { getShoppingCart, addItem, updateItem, removeItem, deleteItem } = require("../controllers/shoppingcarts");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.get("/get", validarJWT, getShoppingCart);

router.post("/add", validarJWT, addItem);

router.put("/update", validarJWT, updateItem);

router.put("/remove", validarJWT, removeItem);

router.delete("/delete", validarJWT, deleteItem);

module.exports = router;
