const express = require("express");
const { createCategory, updateCategory, deleteCategory, setStatusCategory, getCategories, getCategoriesForHome } = require("../controllers/categories");

const uploadFile = require("../middlewares/uploadFile");

const router = express.Router();

router.post("/create", uploadFile("icon", "uploads/icons/categories"), createCategory);

router.put("/update", updateCategory);

router.delete("/delete", deleteCategory);

router.put("/status", setStatusCategory);

router.get("/get", getCategories);

router.get("/home", getCategoriesForHome);

module.exports = router;
