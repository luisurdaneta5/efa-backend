const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Refill = require("../models/refill");

const createRefill = (req, res = response) => {
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
		refill.save();

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
module.exports = {
	createRefill,
};
