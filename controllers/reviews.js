const { response } = require("express");
const Review = require("../models/reviews");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product");
const User = require("../models/user");
const { Op } = require("sequelize");

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

const getReviews = async (req, res = response) => {
	const { page, size, query } = req.query;

	const term = query.trim().toLowerCase();

	try {
		const reviews = await Review.findAndCountAll({
			attributes: {
				exclude: ["userId", "productId", "orderId", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: ["category", "createdAt", "updatedAt", "status", "description", "price", "discount", "stock", "profit", "cost", "brand"],
					},
				},
				{
					model: User,
					attributes: {
						exclude: ["id", "password", "createdAt", "updatedAt", "status", "type", "phone", "email"],
					},
				},
			],
			limit: parseInt(size),
			offset: parseInt(page * size),
			where: {
				[Op.or]: [
					{
						rating: {
							[Op.like]: "%" + term + "%",
						},
					},
				],
			},
		});

		res.status(200).json({
			ok: true,
			reviews,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const changeStatusReviews = async (req, res = response) => {
	const body = req.body;

	try {
		const review = await Review.findOne({ where: { id: body.id } });

		review.status = 0;
		review.save();

		res.status(200).json({
			ok: true,
			msg: "Se ha cambiado el estado de la calificacion",
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const deleteReview = async (req, res = response) => {
	const body = req.query;
	try {
		const review = await Review.findOne({ where: { id: body.id } });

		review.destroy();

		res.status(200).json({
			ok: true,
			msg: "Se ha eliminado la calificacion",
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
	getReviews,
	changeStatusReviews,
	deleteReview,
};
