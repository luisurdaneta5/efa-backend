const express = require("express");
const {
	createCategory,
	updateCategory,
	deleteCategory,
	setStatusCategory,
} = require("../controllers/categories");

const router = express.Router();

router.post("/create", createCategory);

router.put("/update", updateCategory);

router.delete("/delete", deleteCategory);

router.put("/status", setStatusCategory);

module.exports = router;
