const { response } = require("express");
const Review = require("../models/reviews");
const { v4: uuidv4 } = require("uuid");

const createReview = async (req, res = response) => {
	const body = req.body;

	try {
		const data = {
			...body,
			id: uuidv4(),
		};

		const review = new Review(data);
		review.save();

		res.status(200).json({
			ok: true,
			msg: "Su calificacion fue enviada correctamente",
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

module.exports = {
	createReview,
};
