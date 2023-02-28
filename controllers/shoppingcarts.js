const { response } = require("express");
const ShoppingCart = require("../models/shoppingcart");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product");

const getShoppingCart = async (req, res = response) => {
	const body = req.query;
	const items = [];

	try {
		const cart = await ShoppingCart.findAll({
			where: {
				userId: body.uid,
			},
			attributes: {
				exclude: ["productId", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: [
							"category",
							"description",
							"stock",
							"cost",
							"profit",
							"brand",
							"status",
							"createdAt",
							"updatedAt",
						],
					},
				},
			],
		});

		cart.map((item) => {
			if (item.product.discount !== 0) {
				const data = {
					id: item.product.id,
					name: item.product.name,
					price: item.product.price - (item.product.price * item.product.discount) / 100,
					images: item.product.img,
					count: item.count,
				};
				items.push(data);
			} else {
				const data = {
					id: item.product.id,
					name: item.product.name,
					price: item.product.price,
					images: item.product.img,
					count: item.count,
				};
				items.push(data);
			}
		});

		res.status(200).json({
			ok: true,
			items,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const addItem = (req, res = response) => {
	const body = req.body;

	try {
		const data = {
			id: uuidv4(),
			userId: body.uid,
			productId: body.product,
			count: 1,
		};

		const item = new ShoppingCart(data);
		item.save();

		res.status(200).json({
			ok: true,
			msg: "Producto agregado exitosamente",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const updateItem = async (req, res = response) => {
	const body = req.body;

	try {
		const product = await ShoppingCart.findOne({
			where: {
				userId: body.uid,
				productId: body.productId,
			},
		});

		product.update({
			count: body.count,
		});

		res.status(200).json({
			ok: true,
			msg: "Producto agregado exitosamente",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const removeItem = async (req, res = response) => {
	const body = req.body;

	try {
		const product = await ShoppingCart.findOne({
			where: {
				userId: body.uid,
				productId: body.productId,
			},
		});

		product.update({
			count: body.count,
		});

		res.status(200).json({
			ok: true,
			msg: "Producto removido exitosamente",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const deleteItem = async (req, res = response) => {
	const body = req.query;

	console.log(body);
	try {
		const product = await ShoppingCart.findOne({
			where: {
				userId: body.userId,
				productId: body.productId,
			},
		});

		product.destroy();

		res.status(200).json({
			ok: true,
			msg: "Producto removido exitosamente",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

module.exports = { getShoppingCart, addItem, updateItem, removeItem, deleteItem };
