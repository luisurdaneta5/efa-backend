const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generarJWT } = require("../helpers/jwt");
const Balance = require("../models/balance");
const Avatar = require("../models/avatar");
const userRegisterMail = require("../mails/userRegisterMail");

const createUser = async (req, res = response) => {
    const body = req.body;

    try {
        let user = await User.findOne({
            where: {
                email: body.email,
            },
        });

        if (user) {
            res.status(404).json({
                ok: false,
                msg: "El correo ya está registrado",
            });
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(body.password, salt);

            const data = {
                ...body,
                id: uuidv4(),
                password: hash,
            };

            user = new User(data);
            user.save();

            const balanceData = {
                id: uuidv4(),
                userId: user.id,
                amount: 0,
            };

            const balance = new Balance(balanceData);
            balance.save();

            const avatarData = {
                id: uuidv4(),
                userId: user.id,
                avatarUrl: " ",
            };

            const avatar = new Avatar(avatarData);
            avatar.save();

            userRegisterMail(body.email);

            res.status(200).json({
                ok: true,
                msg: "Usuario creado exitosamente",
                user,
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const setLogin = async (req, res = response) => {
    const body = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: body.email,
            },
            include: [
                {
                    model: Avatar,
                    attributes: {
                        exclude: ["userId", "id", "createdAt", "updatedAt"],
                    },
                },
            ],
        });

        if (user) {
            const validPassword = bcrypt.compareSync(body.password, user.password);

            if (!validPassword) {
                res.status(400).json({
                    ok: true,
                    msg: "Contaseña incorrecta",
                });
            } else {
                const token = await generarJWT(user.id, user.type);

                res.status(200).json({
                    ok: true,
                    uid: user.id,
                    name: user.name,
                    type: user.type,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar.avatarUrl,
                    token,
                });
            }
        } else {
            res.status(404).json({
                ok: false,
                msg: "Este usuario no existe",
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const type = req.type;

    const user = await User.findOne({
        where: {
            id: uid,
        },
        include: [
            {
                model: Avatar,
                attributes: {
                    exclude: ["userId", "id", "createdAt", "updatedAt"],
                },
            },
        ],
    });

    const token = await generarJWT(uid, type);

    res.status(200).json({
        ok: true,
        uid,
        type,
        token,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar.avatarUrl,
    });
};

module.exports = {
    createUser,
    setLogin,
    renewToken,
};
