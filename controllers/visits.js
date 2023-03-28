const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Visit = require("../models/visits");

const setVisit = async (req, res = response) => {
	const body = req.body;

	try {
		const data = {
			id: uuidv4(),
			ip: body.ip,
		};

		let visit = await Visit.findOne({
			where: {
				ip: body.ip,
			},
		});

		if (!visit) {
			visit = new Visit(data);
			visit.save();
		}
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getVisits = async (req, res = response) => {
	try {
		const visits = await Visit.findAll();

		res.status(200).json({
			ok: true,
			visits: visits.length,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const deleteVisits = async (req, res = response) => {
	try {
		const visits = await Visit.destroy({
			where: {},
			truncate: true,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

module.exports = { setVisit, getVisits, deleteVisits };
