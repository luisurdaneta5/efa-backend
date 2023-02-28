const express = require("express");
const { updateUser, getUsers, deleteUser, updateProfile, getUser, changePassword, changeAvatar } = require("../controllers/users");
const uploadFile = require("../middlewares/uploadFile");
const { validarJWT } = require("../middlewares/validarJWT");

const router = express.Router();

router.put("/update", validarJWT, updateUser);

router.get("/get", validarJWT, getUsers);

router.delete("/delete", validarJWT, deleteUser);

router.put("/update/profile", validarJWT, updateProfile);

router.get("/get/single", validarJWT, getUser);

router.put("/change_password", validarJWT, changePassword);

router.put("/change_avatar", validarJWT, uploadFile("avatar", "uploads/avatars"), changeAvatar);

module.exports = router;
