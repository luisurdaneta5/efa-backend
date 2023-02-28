const response = require("express");
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category");
const Product = require("../models/product");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../models/connectionDb");
const Favorite = require("../models/favorites");
const Review = require("../models/reviews");
const User = require("../models/user");
const Avatar = require("../models/avatar");

const getCategories = async (req, res = response) => {
	try {
		const categories = await Category.findAll({
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			categories,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado favor intente mas tarde",
		});
	}
};

const createProduct = async (req, res = response) => {
	const body = req.body;
	const file = req.file;

	try {
		const data = {
			...body,
			id: uuidv4(),
			status: body.stock == 0 ? 0 : 1,
			img: process.env.URL_FILE + "/" + file.destination + "/" + file.filename,
			description: body.description === undefined ? " " : body.description,
		};

		const product = new Product(data);
		product.save();

		res.status(200).json({
			ok: true,
			msg: "Producto creado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado favor intente mas tarde",
		});
	}
};

const getProducts = async (req, res = response) => {
	const { page, size, query, id } = req.query;
	try {
		if (id) {
			const product = await Product.findOne({
				where: {
					id: id,
				},
				attributes: {
					exclude: ["id", "createdAt", "updatedAt", "cost", "profit"],
				},
				include: {
					model: Review,
					attributes: {
						exclude: ["userId", "productId", "orderId", "updatedAt"],
					},
					include: {
						model: User,
						attributes: {
							exclude: ["id", "email", "phone", "password", "type", "createdAt", "updatedAt"],
						},
						include: {
							model: Avatar,
							attributes: {
								exclude: ["id", "userId", "createdAt", "updatedAt"],
							},
						},
					},
				},
			});

			res.status(200).json({
				ok: true,
				product,
			});
		} else {
			const term = query.trim().toLowerCase();

			const num = parseFloat(term);

			const products = await Product.findAndCountAll({
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				include: {
					model: Review,
					attributes: {
						exclude: ["userId", "productId", "orderId", "updatedAt", "status", "createdAt", "comment"],
					},
				},
				limit: parseInt(size),
				offset: parseInt(page * size),
				where: {
					[Op.or]: [
						{
							id: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							name: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							category: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							brand: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							price: { [Op.like]: "%" + num + "%" },
						},
						{
							profit: { [Op.eq]: num },
						},
					],
				},
			});

			res.status(200).json({
				ok: true,
				products,
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

const setStatusProduct = async (req, res = response) => {
	const { id, status } = req.query;

	try {
		await Product.update(
			{
				status: status,
			},
			{
				where: {
					id: id,
				},
			}
		);

		res.status(200).json({
			ok: true,
			msg: status ? "Producto Habilitado" : "Producto Deshabilitado",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado favor intente mas tarde",
		});
	}
};

const productUpdate = async (req, res = response) => {
	const body = req.body;
	const file = req.file;

	try {
		if (file) {
			const product = await Product.findOne({
				where: {
					id: body.id,
				},
			});

			const data = {
				...body,
				status: body.stock == 0 ? 0 : 1,
				img: process.env.URL_FILE + "/" + file.destination + "/" + file.filename,
				description: body.description === undefined ? " " : body.description,
			};

			const oldFile = path.basename(product.img);

			fs.unlinkSync("uploads/products/" + oldFile);

			await product.update(data);

			res.status(200).json({
				ok: true,
				msg: "Producto actualizado correctamente.",
			});
		} else {
			const product = await Product.findOne({
				where: {
					id: body.id,
				},
			});

			const img = product.img;

			const data = {
				...body,
				status: body.stock == 0 ? 0 : 1,
				img: img,
				description: body.description === undefined ? " " : body.description,
			};

			await product.update(data);

			res.status(200).json({
				ok: true,
				msg: "Producto actualizado correctamente.",
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

const deleteProduct = async (req, res = response) => {
	const { id } = req.query;

	try {
		const product = await Product.findOne({
			where: {
				id: id,
			},
		});

		const name = product.name;

		const file = path.basename(product.img);
		fs.unlinkSync("uploads/products/" + file);

		product.destroy();

		res.status(2000).json({
			ok: true,
			msg: name,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado favor intente mas tarde",
		});
	}
};

const getProductsWithDiscount = async (req, res = response) => {
	try {
		const products = await Product.findAll({
			attributes: {
				exclude: ["createdAt", "updatedAt", "cost", "profit"],
			},
			where: {
				discount: {
					[Op.ne]: 0,
				},
				status: 1,
			},
			include: {
				model: Review,
				attributes: {
					exclude: ["userId", "productId", "orderId", "updatedAt", "status", "createdAt", "comment"],
				},
			},
			order: sequelize.random(),
			limit: 24,
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

const getProductsHome = async (req, res = response) => {
	const { query } = req.query;

	const term = query.trim().toLowerCase();
	try {
		const products = await Product.findAll({
			attributes: {
				exclude: ["status", "createdAt", "updatedAt", "cost", "profit"],
			},
			include: {
				model: Review,
				attributes: {
					exclude: ["userId", "productId", "orderId", "updatedAt", "status", "createdAt", "comment"],
				},
			},
			order: sequelize.random(),
			limit: 8,
			where: {
				status: 1,
				[Op.or]: [
					{
						category: {
							[Op.like]: "%" + term + "%",
						},
					},
				],
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
	getCategories,
	createProduct,
	getProducts,
	setStatusProduct,
	productUpdate,
	deleteProduct,
	getProductsWithDiscount,
	getProductsHome,
};