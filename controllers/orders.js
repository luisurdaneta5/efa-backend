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
const User = require("../models/user");

const createOrder = async (req, res = response) => {
	const body = req.body;

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
				sale_date: Date.now(),
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

				// console.log(moment(order.createdAt).format("YYYY-MM-DD"));
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
		if (!body.uid) {
			const order = await Order.findOne({
				where: {
					id: body.id,
				},
				attributes: {
					exclude: ["id", "userId", "updatedAt", "createdAt", "delivary_date"],
				},
				include: [
					{
						model: User,
						attributes: {
							exclude: ["id", "password", "type", "createdAt", "updatedAt"],
						},
					},
				],
			});

			res.status(200).json({
				ok: true,
				order,
			});
		} else {
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
		}
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getOrders = async (req, res = response) => {
	let amount = 0;
	try {
		const orders = await Order.findAndCountAll({
			attributes: {
				exclude: ["id", "name", "dni", "email", "phone", "address", "userId", "note", "updatedAt", "products", "delivery_date", "discount", "createdAt", "status"],
			},
		});

		orders.rows.forEach((order) => {
			amount = amount + Number(order.total);
		});

		res.status(200).json({
			ok: true,
			cant: orders.count,
			amount,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getOrdersPending = async (req, res = response) => {
	const { page, size, query } = req.query;
	let status = 0;

	const term = query.trim().toLowerCase();

	if (term == "pendiente") {
		status = 0;
	} else if (term == "procesando") {
		status = 1;
	} else if (term == "empacado") {
		status = 2;
	}

	const num = parseFloat(term);

	try {
		const orders = await Order.findAndCountAll({
			where: {
				status: 0,
				[Op.or]: [
					{
						id: {
							[Op.like]: "%" + term + "%",
						},
					},
					{
						sale_date: {
							[Op.like]: "%" + term + "%",
						},
					},
					{
						total: {
							[Op.like]: "%" + num + "%",
						},
					},
					{
						status: {
							[Op.like]: "%" + status + "%",
						},
					},
				], //status  0 = pendiente, 1 = procesando, 2 = empacado y 3 = entregado,
			},
			attributes: {
				exclude: ["userId", "products", "name", "dni", "email", "phone", "address", "note", "updatedAt", "delivery_date", "discount"],
			},
			include: [
				{
					model: User,
					attributes: {
						exclude: ["id", "email", "createdAt", "updatedAt", "phone", "password", "type"],
					},
				},
			],
			limit: parseInt(size),
			offset: parseInt(page * size),
		});

		res.status(200).json({
			ok: true,
			orders,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getOrdersComplete = async (req, res = response) => {
	const { page, size, query } = req.query;

	const term = query.trim().toLowerCase();

	const num = parseFloat(term);

	try {
		const orders = await Order.findAndCountAll({
			where: {
				status: 3,
				[Op.or]: [
					{
						id: {
							[Op.like]: "%" + term + "%",
						},
					},
					{
						sale_date: {
							[Op.like]: "%" + term + "%",
						},
					},
					{
						total: {
							[Op.like]: "%" + num + "%",
						},
					},
				], //status  0 = pendiente, 1 = procesando, 2 = empacado y 3 = entregado,
			},
			attributes: {
				exclude: ["userId", "products", "name", "dni", "email", "phone", "address", "note", "updatedAt", "delivery_date", "discount"],
			},
			include: [
				{
					model: User,
					attributes: {
						exclude: ["id", "email", "createdAt", "updatedAt", "phone", "password", "type"],
					},
				},
			],
			limit: parseInt(size),
			offset: parseInt(page * size),
		});

		res.status(200).json({
			ok: true,
			orders,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const changeStatusOrder = async (req, res = response) => {
	const { body } = req;

	try {
		const order = await Order.findOne({
			where: {
				id: body.id,
			},
		});

		order.update({
			status: body.status,
		});

		res.status(200).json({
			ok: true,
			msg: "El estado de la orden ha sido actualizado",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getOrdersForDashboard = async (req, res = response) => {
	try {
		const orders = await Order.findAll({
			where: {
				status: {
					[Op.not]: 3,
				},
			},
			limit: 5,
			order: [["sale_date", "DESC"]],
			attributes: {
				exclude: ["userId", "products", "name", "dni", "email", "phone", "address", "note", "updatedAt", "delivery_date", "discount", "sale_date"],
			},
			include: [
				{
					model: User,
					attributes: {
						exclude: ["id", "email", "createdAt", "updatedAt", "phone", "password", "type"],
					},
				},
			],
		});

		res.status(200).json({
			ok: true,
			orders,
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
	getOrdersPending,
	getOrders,
	getOrdersComplete,
	changeStatusOrder,
	getOrdersForDashboard,
};
