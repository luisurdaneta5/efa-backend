const { response } = require("express");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product");
const Record = require("../models/record");

const setRecord = async (req, res = response) => {
	const body = req.body;

	try {
		const data = {
			id: uuidv4(),
			userId: body.uid,
			productId: body.productId,
		};

		let product = await Record.findOne({
			where: {
				[Op.and]: [{ userId: body.uid }, { productId: body.productId }],
			},
		});

		if (product) {
			product.destroy();
		}

		product = new Record(data);
		product.save();

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

const getRecord = async (req, res = response) => {
	const body = req.query;

	try {
		const products = await Record.findAll({
			where: {
				userId: body.uid,
			},
			attributes: {
				exclude: ["id", "userId", "productId", "createdAt", "updatedAt"],
			},
			include: {
				model: Product,
				attributes: {
					exclude: ["name", "category", "description", "brand", "stock", "cost", "profit", "price", "discount", "status", "createdAt", "updatedAt"],
				},
			},
		});

		res.status(200).json({
			ok: true,
			products,
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
	setRecord,
	getRecord,
};
