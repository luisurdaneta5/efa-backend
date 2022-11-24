const express = require("express");
const { createUser, updateUser } = require("../controllers/users");

const router = express.Router();

router.post("/create", createUser);

router.put("/update", updateUser);

module.exports = router;
