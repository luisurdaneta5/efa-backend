const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Email = require("../models/email");

const setRegisterEmailNotifications = async (req, res = response) => {
    const { email, notification } = req.body;
    try {
        const data = {
            id: uuidv4(),
            email,
            notifications: notification,
        };

        const email_notifications = new Email(data);
        email_notifications.save();

        res.json({
            ok: true,
            msg: "Se ha registrado el email",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const getNotificationsEmails = async (req, res = response) => {
    try {
        const emails = await Email.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.json({
            ok: true,
            emails,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const setDeleteNotificationsEmails = async (req, res = response) => {
    const { id } = req.query;
    try {
        const email = await Email.findByPk(id);

        await email.destroy();

        res.json({
            ok: true,
            msg: "Se ha eliminado el email",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

module.exports = {
    setRegisterEmailNotifications,
    getNotificationsEmails,
    setDeleteNotificationsEmails,
};
