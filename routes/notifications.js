const express = require("express");
const { validarJWT } = require("../middlewares/validarJWT");
const { setRegisterEmailNotifications, getNotificationsEmails, setDeleteNotificationsEmails } = require("../controllers/notifications");

const router = express.Router();

router.post("/register", validarJWT, setRegisterEmailNotifications);

router.get("/emails", getNotificationsEmails);

router.delete("/delete", validarJWT, setDeleteNotificationsEmails);

module.exports = router;
