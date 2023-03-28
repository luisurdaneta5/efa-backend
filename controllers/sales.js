const { response } = require("express");
const Sale = require("../models/sales");
const moment = require("moment");
const Product = require("../models/product");
const Order = require("../models/order");
const { Op } = require("sequelize");

const getSalesToday = async (req, res) => {
	const today = moment().format("YYYY-MM-DD");
	let amount = 0;
	try {
		const salesToday = await Sale.findAll({
			where: {
				sale_date: today,
			},
			attributes: {
				exclude: ["id", "productId", "sale_date", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: ["id", "name", "category", "description", "brand", "stock", "cost", "profit", "img", "status", "createdAt", "updatedAt"],
					},
				},
			],
		});

		salesToday.forEach((sale) => {
			if (sale.product.discount) {
				const discount = (sale.product.price * sale.product.discount) / 100;

				const price = (sale.product.price - discount) * sale.cant;

				amount = amount + price;
			} else {
				const price = sale.product.price * sale.cant;
				amount = amount + price;
			}
		});

		res.status(200).json({
			ok: true,
			amount,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getSalesWeek = async (req, res) => {
	const month = moment().format("YYYY-MM");

	let amount = 0;
	try {
		const sales = await Sale.findAll({
			attributes: {
				exclude: ["id", "productId", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: ["id", "name", "category", "description", "brand", "stock", "cost", "profit", "img", "status", "createdAt", "updatedAt"],
					},
				},
			],
		});

		sales.forEach((sale) => {
			if (moment(sale.sale_date).format("YYYY-MM") == month) {
				if (moment(sale.sale_date).week() == moment().week()) {
					if (sale.product.discount) {
						const discount = (sale.product.price * sale.product.discount) / 100;

						const price = (sale.product.price - discount) * sale.cant;

						amount = amount + price;
					} else {
						const price = sale.product.price * sale.cant;
						amount = amount + price;
					}
				}
			}
		});

		res.status(200).json({
			ok: true,
			amount,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getSalesMonth = async (req, res) => {
	const Month = moment().format("YYYY-MM");

	let amount = 0;
	try {
		const salesMonth = await Sale.findAll({
			attributes: {
				exclude: ["id", "productId", "sale_date", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: ["id", "name", "category", "description", "brand", "stock", "cost", "profit", "img", "status", "createdAt", "updatedAt"],
					},
				},
			],
		});
		salesMonth.forEach((sale) => {
			if (moment(sale.sale_date).format("YYYY-MM") == Month) {
				if (sale.product.discount) {
					const discount = (sale.product.price * sale.product.discount) / 100;

					const price = (sale.product.price - discount) * sale.cant;

					amount = amount + price;
				} else {
					const price = sale.product.price * sale.cant;
					amount = amount + price;
				}
			}
		});
		res.status(200).json({
			ok: true,
			amount,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getProductsSales = async (req, res) => {
	let amount = 0;
	let cant = 0;
	try {
		const sales = await Sale.findAll({
			attributes: {
				exclude: ["id", "productId", "sale_date", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Product,
					attributes: {
						exclude: ["id", "name", "category", "description", "brand", "stock", "cost", "profit", "img", "status", "createdAt", "updatedAt"],
					},
				},
			],
		});

		sales.forEach((sale) => {
			cant = cant + sale.cant;
			if (sale.product.discount) {
				const discount = (sale.product.price * sale.product.discount) / 100;
				const price = (sale.product.price - discount) * sale.cant;
				amount = amount + price;
			} else {
				const price = sale.product.price * sale.cant;
				amount = amount + price;
			}
		});

		res.status(200).json({
			ok: true,
			amount,
			cant,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const getChartSales = async (req, res) => {
	const ThisYear = moment().format("YYYY");
	const lastYear = moment().subtract(1, "year").format("YYYY");
	const salesNowYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const salesPastYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let ene = 0;
	let feb = 0;
	let mar = 0;
	let abr = 0;
	let may = 0;
	let jun = 0;
	let jul = 0;
	let ago = 0;
	let sep = 0;
	let oct = 0;
	let nov = 0;
	let dic = 0;

	try {
		const salesThisYear = await Order.findAll({
			where: {
				status: {
					[Op.not]: 4,
				},
				sale_date: {
					[Op.like]: "%" + ThisYear + "%",
				},
			},
			attributes: {
				exclude: ["id", "userId", "status", "createdAt", "updatedAt", "products", "status", "dni", "name", "email", "phone", "address", "note", "delivery_date"],
			},
		});

		salesThisYear.forEach((sale) => {
			if (moment(sale.sale_date).format("MM") == 01) {
				ene = ene + Number(sale.total);
				salesNowYear.splice(0, 1, ene);
			}

			if (moment(sale.sale_date).format("MM") == 02) {
				feb = feb + Number(sale.total);
				salesNowYear.splice(1, 1, feb);
			}

			if (moment(sale.sale_date).format("MM") == 03) {
				mar = mar + Number(sale.total);
				salesNowYear.splice(2, 1, mar);
			}

			if (moment(sale.sale_date).format("MM") == 04) {
				abr = abr + Number(sale.total);
				salesNowYear.splice(3, 1, abr);
			}

			if (moment(sale.sale_date).format("MM") == 05) {
				may = may + Number(sale.total);
				salesNowYear.splice(4, 1, may);
			}

			if (moment(sale.sale_date).format("MM") == 06) {
				jun = jun + Number(sale.total);
				salesNowYear.splice(5, 1, jun);
			}

			if (moment(sale.sale_date).format("MM") == 07) {
				jul = jul + Number(sale.total);
				salesNowYear.splice(6, 1, jul);
			}

			if (moment(sale.sale_date).format("MM") == 08) {
				ago = ago + Number(sale.total);
				salesNowYear.splice(7, 1, ago);
			}

			if (moment(sale.sale_date).format("MM") == 09) {
				sep = sep + Number(sale.total);
				salesNowYear.splice(8, 1, sep);
			}

			if (moment(sale.sale_date).format("MM") == 10) {
				oct = oct + Number(sale.total);
				salesNowYear.splice(9, 1, oct);
			}

			if (moment(sale.sale_date).format("MM") == 11) {
				nov = nov + Number(sale.total);
				salesNowYear.splice(10, 1, nov);
			}

			if (moment(sale.sale_date).format("MM") == 12) {
				dic = dic + Number(sale.total);
				salesNowYear.splice(11, 1, dic);
			}
		});

		const salesLastYear = await Order.findAll({
			where: {
				sale_date: {
					[Op.like]: "%" + lastYear + "%",
				},
			},
		});

		salesLastYear.forEach((sale) => {
			if (moment(sale.sale_date).format("MM") == 01) {
				ene = ene + Number(sale.total);
				salesPastYear.splice(0, 1, ene);
			}

			if (moment(sale.sale_date).format("MM") == 02) {
				feb = feb + Number(sale.total);
				salesPastYear.splice(1, 1, feb);
			}

			if (moment(sale.sale_date).format("MM") == 03) {
				mar = mar + Number(sale.total);
				salesPastYear.splice(2, 1, mar);
			}

			if (moment(sale.sale_date).format("MM") == 04) {
				abr = abr + Number(sale.total);
				salesPastYear.splice(3, 1, abr);
			}

			if (moment(sale.sale_date).format("MM") == 05) {
				may = may + Number(sale.total);
				salesPastYear.splice(4, 1, may);
			}

			if (moment(sale.sale_date).format("MM") == 06) {
				jun = jun + Number(sale.total);
				salesPastYear.splice(5, 1, jun);
			}

			if (moment(sale.sale_date).format("MM") == 07) {
				jul = jul + Number(sale.total);
				salesPastYear.splice(6, 1, jul);
			}

			if (moment(sale.sale_date).format("MM") == 08) {
				ago = ago + Number(sale.total);
				salesPastYear.splice(7, 1, ago);
			}

			if (moment(sale.sale_date).format("MM") == 09) {
				sep = sep + Number(sale.total);
				salesPastYear.splice(8, 1, sep);
			}

			if (moment(sale.sale_date).format("MM") == 10) {
				oct = oct + Number(sale.total);
				salesPastYear.splice(9, 1, oct);
			}

			if (moment(sale.sale_date).format("MM") == 11) {
				nov = nov + Number(sale.total);
				salesPastYear.splice(10, 1, nov);
			}

			if (moment(sale.sale_date).format("MM") == 12) {
				dic = dic + Number(sale.total);
				salesPastYear.splice(11, 1, dic);
			}
		});

		res.status(200).json({
			ok: true,
			ThisYear,
			salesNowYear,
			lastYear,
			salesPastYear,
		});
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};
module.exports = { getSalesToday, getProductsSales, getSalesMonth, getSalesWeek, getChartSales };
