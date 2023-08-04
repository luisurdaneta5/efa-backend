const express = require("express");
const {
    getCategories,
    createProduct,
    getProducts,
    setStatusProduct,
    productUpdate,
    deleteProduct,
    getProductsWithDiscount,
    getProductsHome,
    getProductsWithOutStock,
    getProductsByFilter,
} = require("../controllers/products");
const uploadFile = require("../middlewares/uploadFile");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.get("/categories", getCategories);

router.post("/create", validarJWT, uploadFile("img", "uploads/products"), createProduct);

router.get("/get", getProducts);

router.get("/status", setStatusProduct);

router.put("/update", uploadFile("img", "uploads/products"), productUpdate);

router.delete("/delete", deleteProduct);

router.get("/discount", getProductsWithDiscount);

router.get("/home", getProductsHome);

router.get("/outstock", getProductsWithOutStock);

router.get("/get/filter", getProductsByFilter);

module.exports = router;
