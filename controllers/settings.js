const { response } = require("express");
const Setting = require("../models/settings");
const Slider = require("../models/slider");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

const getSettings = async (req, res = response) => {
    try {
        const settings = await Setting.findOne({
            where: {
                id: "577a409c-fcb5-4921-b098-37ea1675dc96",
            },
        });

        res.status(200).json({
            ok: true,
            settings,
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const generalSetting = async (req, res = response) => {
    const body = req.body;

    try {
        const setting = await Setting.findOne({
            where: {
                id: body.id,
            },
        });

        setting.update(body);
        res.status(200).json({
            ok: true,
            msg: "Actulizacion exitosa.",
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const rrsSetting = async (req, res = response) => {
    const body = req.body;

    try {
        const setting = await Setting.findOne({
            where: {
                id: body.id,
            },
        });

        setting.update(body);
        res.status(200).json({
            ok: true,
            msg: "Actulizacion exitosa.",
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const moneySetting = async (req, res = response) => {
    const body = req.body;

    try {
        const setting = await Setting.findOne({
            where: {
                id: body.id,
            },
        });

        setting.update(body);
        res.status(200).json({
            ok: true,
            msg: "Actulizacion exitosa.",
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Ha ocurrido un error inesperado",
        });
        console.log(error);
    }
};

const bannerSetting = async (req, res = response) => {
    const file = req.file;

    try {
        const data = {
            id: uuid(),
            url: process.env.URL_FILE + "/" + file.destination + "/" + file.filename,
        };

        const slider = new Slider(data);
        await slider.save();

        res.status(200).json({
            ok: true,
            msg: "Image subida exitosamente",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const getBanners = async (req, res = response) => {
    try {
        const banners = await Slider.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        res.status(200).json({
            ok: true,
            banners,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const deleteBanner = async (req, res = response) => {
    const { id } = req.query;

    try {
        const banner = await Slider.findOne({
            where: {
                id,
            },
        });

        const file = path.basename(banner.url);

        fs.unlinkSync("uploads/banners/" + file);

        banner.destroy();

        res.status(200).json({
            ok: true,
            msg: "Banner eliminado exitosamente",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado",
        });
    }
};

const textSetting = async (req, res = response) => {
    const body = req.body;

    const data = {
        text1: body.text1,
        text2: body.text2,
        statusText: body.checked,
    };
    console.log(data);
    try {
        const setting = await Setting.findOne({
            where: {
                id: body.id,
            },
        });

        setting.update(data);

        res.status(200).json({
            ok: true,
            msg: "Actualizado correctamente",
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
    getSettings,
    generalSetting,
    rrsSetting,
    moneySetting,
    bannerSetting,
    getBanners,
    deleteBanner,
    textSetting,
};
