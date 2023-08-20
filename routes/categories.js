const express = require("express");
const { createCategory, updateCategory, deleteCategory, setStatusCategory, getCategories, getCategoriesForHome } = require("../controllers/categories");

const uploadFile = require("../middlewares/uploadFile");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/create", validarJWT, uploadFile("icon", "uploads/icons/categories"), createCategory);

router.put("/update", validarJWT, updateCategory);

router.delete("/delete", validarJWT, deleteCategory);

router.put("/status", validarJWT, setStatusCategory);

router.get("/get", getCategories);

router.get("/home", getCategoriesForHome);

module.exports = router;
