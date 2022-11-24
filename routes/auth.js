const express = require("express");
const { createUser, setLogin, renewToken } = require("../controllers/auths");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.post("/user/create", createUser);

router.post("/login", setLogin);

router.get("/renew", validarJWT, renewToken);

module.exports = router;
