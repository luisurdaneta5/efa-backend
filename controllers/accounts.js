const { response } = require("express");
const Account = require("../models/account");
const { v4: uuid } = require("uuid");

const getAccounts = async (req, res = response) => {
    try {
        const accounts = await Account.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.status(200).json({
            ok: true,
            accounts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const addAccount = async (req, res = response) => {
    const file = req.file;
    const body = req.body;

    try {
        const data = {
            id: uuid(),
            ...body,
            img: process.env.URL_FILE + "/" + file.destination + "/" + file.filename,
        };

        const account = new Account(data);
        await account.save();

        res.status(200).json({
            ok: true,
            msg: "Cuenta agregada exitosamente",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

module.exports = {
    getAccounts,
    addAccount,
};
