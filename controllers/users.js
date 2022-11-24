const { response } = require("express");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { Op } = require("sequelize");

const createUser = async (req, res = response) => {
	const body = req.body;

	try {
		let user = await User.findOne({
			where: {
				email: body.email,
			},
		});

		if (!user) {
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(body.password, salt);

			const data = {
				...body,
				id: uuid(),
				password: hash,
			};

			user = new User(data);
			user.save();

			res.status(200).json({
				ok: true,
				msg: "Usuario creado exitosamente",
			});
		} else {
			res.status(500).json({
				ok: false,
				msg: "Disculpe, ya existe un usuario con ese correo",
			});
		}
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const updateUser = async (req, res = response) => {
	const body = req.body;

	try {
		let user = await User.findOne({
			where: {
				id: {
					[Op.ne]: body.id,
				},
				email: body.email,
			},
		});

		if (!user) {
			await User.update(
				{
					...body,
				},
				{
					where: {
						id: body.id,
					},
				}
			);

			res.status(200).json({
				ok: true,
				msg: "Usuario actualizado correctamente",
			});
		} else {
			res.status(500).json({
				ok: false,
				msg: "Disculpe, ya existe un usuario con ese correo",
			});
		}
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

module.exports = {
	createUser,
	updateUser,
};
