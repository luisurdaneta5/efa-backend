const { response } = require("express");
const Category = require("../models/category");
const { v4: uuid } = require("uuid");

const createCategory = async (req, res = response) => {
	const body = req.body;

	try {
		let category = await Category.findOne({
			where: {
				name: body.name,
			},
		});

		if (!category) {
			const data = {
				...body,
				id: uuid(),
			};

			category = new Category(data);
			category.save();

			res.status(200).json({
				ok: true,
				msg: "Categoria creada exitosamente",
			});
		} else {
			res.status(500).json({
				ok: false,
				msg: "Ya existe una categoria con ese nombre",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const updateCategory = async (req, res = response) => {
	const body = req.body;

	try {
		let category = await Category.findOne({
			where: {
				id: body.id,
			},
		});

		if (category) {
			const categoryByName = await Category.findOne({
				where: {
					name: body.name,
				},
			});

			if (categoryByName) {
				res.status(500).json({
					ok: false,
					msg: "Ya existe una categoria con ese nombre",
				});
			} else {
				category.update({
					name: body.name,
				});

				res.status(200).json({
					ok: true,
					msg: "Categoria actualizada correctamente",
				});
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const deleteCategory = async (req, res = response) => {
	const body = req.query;

	try {
		const category = await Category.findOne({
			where: {
				id: body.id,
			},
		});

		category.destroy();

		res.status(200).json({
			ok: true,
			msg: "Categoria Eliminada",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const setStatusCategory = async (req, res = response) => {
	const body = req.query;

	console.log(body);
	try {
		await Category.update(
			{
				status: body.status,
			},
			{
				where: {
					id: body.id,
				},
			}
		);

		if (body.status == 1) {
			res.status(200).json({
				ok: false,
				msg: "Categoria Habilitada",
			});
		}

		if (body.status == 0) {
			res.status(200).json({
				ok: false,
				msg: "Categoria Deshabilitad",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

module.exports = {
	createCategory,
	updateCategory,
	deleteCategory,
	setStatusCategory,
};
