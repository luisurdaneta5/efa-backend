const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Refill = require("../models/refill");
const User = require("../models/user");
const { Op } = require("sequelize");
const Balance = require("../models/balance");
const exchangeAccept = require("../mails/exchangeAccept");
const exchangeReject = require("../mails/exchangeReject");
const newExchange = require("../mails/newExchange");
const Email = require("../models/email");

const createRefill = async (req, res = response) => {
    const body = req.body;
    const voucher = req.file;

    try {
        const data = {
            ...body,
            id: uuidv4(),
            userId: body.userId,
            voucher: process.env.URL_FILE + "/" + voucher.destination + "/" + voucher.filename,
        };

        const refill = new Refill(data);
        await refill.save();

        const emails = await Email.findAll({
            where: {
                notifications: 2,
            },
            attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
            },
        });

        if (emails) {
            newExchange(emails, refill);
        }

        res.status(200).json({
            ok: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado favor intente mas tarde",
        });
    }
};

const getRefills = async (req, res = response) => {
    const { page, size, query } = req.query;

    const term = query.trim().toLowerCase();

    try {
        const refills = await Refill.findAndCountAll({
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt", "reference", "voucher"],
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "phone", "password", "type"],
                    },
                },
            ],
            limit: parseInt(size),
            offset: parseInt(page * size),
            where: {
                status: 0,
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        bank: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        date: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        tasa: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        reference: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        conversion: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        amount: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                ],
            },
        });

        res.status(200).json({
            ok: true,
            refills,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado favor intente mas tarde",
        });
    }
};

const getRefillsHistory = async (req, res = response) => {
    const { page, size, query } = req.query;

    const term = query.trim().toLowerCase();

    try {
        const refills = await Refill.findAndCountAll({
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt", "reference", "voucher"],
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "phone", "password", "type"],
                    },
                },
            ],
            limit: parseInt(size),
            offset: parseInt(page * size),
            where: {
                status: {
                    [Op.ne]: 0,
                },
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        bank: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        date: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        tasa: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        reference: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        conversion: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                    {
                        amount: {
                            [Op.like]: "%" + term + "%",
                        },
                    },
                ],
            },
        });

        res.status(200).json({
            ok: true,
            refills,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado favor intente mas tarde",
        });
    }
};

const getExchangeById = async (req, res = response) => {
    const { id } = req.params;

    try {
        const refill = await Refill.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt"],
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "phone", "password", "type"],
                    },
                },
            ],
        });

        res.status(200).json({
            ok: true,
            refill,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado favor intente mas tarde",
        });
    }
};

const setChangeStatusExchange = async (req, res = response) => {
    const { id, status, amount, uid, email } = req.body;

    try {
        if (status == 1) {
            const refill = await Refill.findOne({
                where: {
                    id,
                },
            });

            refill.status = status;
            refill.save();

            const balance = await Balance.findOne({
                where: {
                    userId: uid,
                },
            });

            balance.amount = parseFloat(balance.amount) + parseFloat(amount);
            balance.save();

            exchangeAccept(email, id);

            res.status(200).json({
                ok: true,
                msg: "Recarga aprobada con exito",
            });
        } else {
            const refill = await Refill.findOne({
                where: {
                    id,
                },
            });

            refill.status = status;
            refill.save();

            exchangeReject(email, id);

            res.status(200).json({
                ok: true,
                msg: "Recarga rechazada con exito",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado favor intente mas tarde",
        });
    }
};

module.exports = {
    createRefill,
    getRefills,
    getExchangeById,
    setChangeStatusExchange,
    getRefillsHistory,
};
