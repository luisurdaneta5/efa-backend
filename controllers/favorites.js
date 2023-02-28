const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Favorite = require("../models/favorites");
const { Op } = require("sequelize");
const Product = require("../models/product");

const setFavorite = async (req, res = response) => {
	const { favId, favorite, uid, product } = req.body;

	try {
		if (favorite == false) {
			const data = {
				id: uuidv4(),
				userId: uid,
				productId: product,
			};
			const favorite = new Favorite(data);
			favorite.save();
			res.status(200).json({
				ok: true,
				msg: "Producto agregado a favorito",
			});
		} else {
			const favorite = await Favorite.findOne({
				where: {
					[Op.or]: [{ id: favId }, { userId: uid, productId: product }],
				},
			});
			favorite.destroy();
			res.status(200).json({
				ok: true,
				msg: "Producto eliminado de favorito",
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

const getFavorite = async (req, res = response) => {
	const { uid } = req.query;

	try {
		const favorite = await Favorite.findAll({
			where: {
				userId: uid,
			},
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		if (favorite) {
			res.status(200).json({
				ok: true,
				favorite,
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

const getFavorites = async (req, res = response) => {
	const { uid, query, size, page } = req.query;

	try {
		if (query) {
			const term = query.trim().toLowerCase();

			const num = parseFloat(term);

			const favorites = await Favorite.findAndCountAll({
				attributes: {
					exclude: ["userId", "productId", "createdAt", "updatedAt"],
				},
				include: [
					{
						model: Product,
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
							],
						},
					},
				],
				limit: parseInt(size),
				offset: parseInt(page * size),
				where: {
					userId: uid,
				},
			});

			res.status(200).json({
				ok: true,
				favorites,
			});
		} else {
			const favorites = await Favorite.findAndCountAll({
				attributes: {
					exclude: ["userId", "productId", "createdAt", "updatedAt"],
				},
				include: [
					{
						model: Product,
					},
				],
				limit: parseInt(size),
				offset: parseInt(page * size),
				where: {
					userId: uid,
				},
			});

			res.status(200).json({
				ok: true,
				favorites,
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

module.exports = {
	setFavorite,
	getFavorite,
	getFavorites,
};
