const { response } = require("express");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Balance = require("../models/balance");
const Order = require("../models/order");
const Product = require("../models/product");
const ShoppingCart = require("../models/shoppingcart");
const moment = require("moment");
const Sale = require("../models/sales");
const Review = require("../models/reviews");

const createOrder = async (req, res = response) => {
	const body = req.body;

	console.log(body);
	try {
		const balance = await Balance.findOne({
			where: {
				userId: body.userId,
			},
		});

		if (balance.amount == 0) {
			res.status(500).json({
				ok: false,
				msg: "Su saldo es insuficiente para realizar la compra le invitamos a recargar saldo y/o usar otro metodo de pago",
			});
		} else {
			const data = {
				id: uuidv4(),
				userId: body.userId,
				products: body.products,
				status: 0,
				name: body.name,
				dni: body.dni,
				email: body.email,
				phone: body.phone,
				address: body.address,
				note: body.note,
				total: body.amount,
				discount: body.coupon == null ? 0 : body.coupon,
			};
			const order = new Order(data);
			await order.save();

			if (!body.paypal) {
				const newBalance = {
					...balance,
					amount: balance.amount - body.amount,
				};

				balance.update(newBalance);
			}

			const products = await ShoppingCart.findAll({
				where: {
					userId: body.userId,
				},
			});

			for (const product of products) {
				product.destroy();
			}

			for (const product of JSON.parse(body.products)) {
				const found = await Product.findOne({
					where: {
						id: product.id,
					},
				});

				if (found.stock == 0) {
					res.status(500).json({
						ok: false,
						product: found,
						msg: `Alguien ha comprando el ultimo ${found.name}, procederemos a eliminarlo de su carrito de compras`,
					});
				} else {
					const data = {
						...found,
						stock: found.stock - product.count,
					};

					found.update(data);
				}

				console.log(moment(order.createdAt).format("YYYY-MM-DD"));
				const sale = await Sale.findOne({
					where: {
						productId: product.id,
					},
				});

				if (sale && sale.sale_date == moment(order.createdAt).format("YYYY-MM-DD")) {
					sale.update({
						...sale,
						cant: sale.cant + product.count,
					});

					sale.save();
				} else {
					const data = {
						id: uuidv4(),
						productId: product.id,
						cant: product.count,
						sale_date: Date.now(),
					};
					const sale = new Sale(data);
					sale.save();
				}
			}

			res.status(200).json({
				ok: true,
				id: order.id,
				msg: "Su compra ha sido un exito",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const getOrdersUser = async (req, res = response) => {
	const { uid, page, size, query } = req.query;

	try {
		if (query) {
			const term = query.trim().toLowerCase();
			let status = "";

			if (term == "pendiente") {
				status = 0;
			}

			if (term == "cancelado") {
				status = 2;
			}

			if (term == "entregado") {
				status = 1;
			}

			const num = parseFloat(term);

			const orders = await Order.findAndCountAll({
				attributes: {
					exclude: ["userId", "updatedAt"],
				},
				limit: parseInt(size),
				offset: parseInt(page * size),
				where: {
					userId: uid,
					[Op.or]: [
						{
							id: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							status: {
								[Op.like]: "%" + status + "%",
							},
						},
						{
							createdAt: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							total: {
								[Op.like]: "%" + num + "%",
							},
						},
					],
				},
				order: [["createdAt", "DESC"]],
			});

			res.status(200).json({
				ok: true,
				orders,
			});
		} else {
			const orders = await Order.findAndCountAll({
				attributes: {
					exclude: ["userId", "updatedAt"],
				},
				limit: parseInt(size),
				offset: parseInt(page * size),
				where: {
					userId: uid,
				},
			});

			res.status(200).json({
				ok: true,
				orders,
			});
		}
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getOrderById = async (req, res = response) => {
	const body = req.query;

	try {
		const order = await Order.findOne({
			where: {
				id: body.id,
			},
			attributes: {
				exclude: ["id", "name", "dni", "email", "phone", "address", "userId", "note", "updatedAt"],
			},
		});

		const reviews = await Review.findAll({
			where: {
				orderId: body.id,
				userId: body.uid,
			},
			attributes: {
				exclude: ["id", "userId", "orderId", "comment", "status", "createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			order,
			reviews,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

module.exports = {
	createOrder,
	getOrdersUser,
	getOrderById,
};
