const express = require("express");
const { setFavorite, getFavorite, getFavorites } = require("../controllers/favorites");

const router = express.Router();

router.put("/updated", setFavorite);

router.get("/getSingle", getFavorite);

router.get("/getAll", getFavorites);

module.exports = router;
